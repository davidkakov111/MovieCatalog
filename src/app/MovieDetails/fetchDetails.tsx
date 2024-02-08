"use client"
import React, { useEffect, useState } from 'react';
import SlideShow from './SlideShow';
import { update_movie_review } from '../database/dbmethods';

// Function for querying movie data
const fetchMovieDetails = async (title: string) => {
  try {
    const response = await fetch(`/api/MovieDetailsByTitle?title=${encodeURIComponent(title)}`);
    const data = await response.json();
    const result = data.result
    return result;
  } catch (error) {
    console.error('Error occurred while fetching film details:', error);
    return null;
  }
};

// Movie details component
const MovieDetails: React.FC = () => {
  // Initialize state variables for movie data and loading state
  const [movieDetails, setMovieDetails] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title');

    const fetchData = async () => {
      if (!title) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch film data based on title
        const data = await fetchMovieDetails(title);
        if ( typeof data === "string" || data === null ) {
          console.error('Error occurred while fetching the movie details:', data);
          setIsLoading(false);
          return
        }
        setMovieDetails(data[0]);
        const movie = data[0];
        const reviews: number = movie.reviews + 1;

        // Current timestamp
        const timestamp: number = Math.floor(Date.now() / 1000);

        if (movie.review_dates === null) {
          // This movie has not received any reviews yet, so add one
          const dateArray = [timestamp];

          // Convert the array to string
          const review_dates = `[${dateArray.map(item => String(item)).join(', ')}]`;

          // Data for the API
          const Update_movie_review: update_movie_review = {
            "id": movie.id as number,
            "reviews": reviews,
            "review_dates": review_dates,
          };

          // Send a POST request to the backend
          const response = await fetch('/api/updateMovieReview', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(Update_movie_review),
          });

          if (!response.ok) {
            alert("Failed to save the new review for this movie!");
          }
        } else {
          // This movie has already received reviews
          // Convert the string array back
          const reviewdates = eval(movie.review_dates) as number[];
          
          // Add the current timestamp among the others
          reviewdates.push(timestamp);

          // Convert the array back to string
          const review_dates = `[${reviewdates.map(item => String(item)).join(', ')}]`;

          // Data for the API
          const Update_movie_review: update_movie_review = {
            "id": movie.id as number,
            "reviews": reviews,
            "review_dates": review_dates,
          };

          // Send a POST request to the backend
          const response = await fetch('/api/updateMovieReview', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(Update_movie_review),
          });

          if (!response.ok) {
            alert("Failed to save the new review for this movie!");
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error occurred while fetching movie details:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // The dependency array is empty, so useEffect runs only once, when the component mounts

  // Display loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-center">Loading...</h1>
      </div>
    );
  }

  // If there is no data, display a message
  if (!movieDetails || movieDetails === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-center">No data available for the movie!</h1>
      </div>
    )
  }

  // Prepare movie data
  const formattedDate = new Date(movieDetails.release_date).toLocaleDateString();

  // Display movie details
  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-gray-300 rounded-md">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">{movieDetails.title}</h2>
      <div className="flex">
        <div className="flex-1 w-60 overflow-hidden">
          <div className="relative" style={{ paddingBottom: '100%' }}>
            <div className="absolute inset-0">
              <img src={movieDetails.poster_url} className="w-full h-full object-cover aspect-content"/>
            </div>
          </div>
        </div>
        <div className="flex-1 w-60 overflow-hidden">
          <div className="relative" style={{ paddingBottom: '100%' }}>
            <div className="absolute inset-0">
              <SlideShow
                images={[
                  movieDetails.image1,
                  movieDetails.image2,
                  movieDetails.image3,
                  movieDetails.image4,
                  movieDetails.image5,
                ]}
                interval={3000}
              />
            </div>
          </div>
        </div>
      </div>
      <p className="text-gray-700 mb-4">Release date: {formattedDate}</p>
      <p className="text-gray-700 mb-4">Average rating of the film: {Math.round(movieDetails.rating)}/100</p>
      <p className="text-gray-700 mb-4">{movieDetails.description}</p>
    </div>
  );
};

export default MovieDetails;
