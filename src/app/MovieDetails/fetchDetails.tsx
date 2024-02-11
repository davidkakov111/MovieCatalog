"use client"
import React, { useEffect, useState } from 'react';
import SlideShow from './SlideShow';
import { update_movie_review } from '../database/dbmethods';
import ReactStarRatings from 'react-star-ratings';

// Movie details component
const MovieDetails: React.FC = () => {
  const [MovieDetails, setMovieDetails] = useState<any>('');
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch movie details and update review
  const fetchAndUpdateMovieDetails = async (title: string) => {
    try {
      const response = await fetch(`/api/MovieDetailsByTitle?title=${encodeURIComponent(title)}`);
      const data = await response.json();
      const movie = data?.result?.[0];

      // Check if movie details are available
      if (!movie) {
        console.error('Error occurred while fetching the movie details:', data);
        setIsLoading(false);
        return;
      }

      // Set movie details
      setMovieDetails(movie);

      // Increment the number of reviews
      const reviews: number = (movie.reviews || 0) + 1;

      const ReviewDates = JSON.parse(movie.review_dates || '[]');
      const timestamp = Math.floor(Date.now() / 1000);
      ReviewDates.push(timestamp)

      // Prepare data for updating movie review
      const updateMovieReview: update_movie_review = {
        id: movie.id as number,
        reviews: reviews,
        review_dates: JSON.stringify(ReviewDates),
      };

      // Send update request to backend
      await fetch('/api/updateMovieReview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateMovieReview),
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error occurred while fetching details about the movie:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title');

    // Fetch movie details when component mounts
    if (title) {
      fetchAndUpdateMovieDetails(title);
    } else {
      setIsLoading(false);
    }
  }, []);
  
  // Display loading state while fetching movie details
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><h1 className="text-center">Loading...</h1></div>;
  }

  // Display message if no movie details are available
  if (!MovieDetails) {
    return <div className="flex items-center justify-center h-screen"><h1 className="text-center">No data available for the movie!</h1></div>;
  }

  // Format release date
  const formattedDate = new Date(MovieDetails.release_date).toLocaleDateString();

  // Render movie details
  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-gray-300 rounded-md">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">{MovieDetails.title}</h2>
      <div className="flex">
        {/* Render movie poster */}
        <div className="flex-1 w-60 overflow-hidden">
          <div className="relative" style={{ paddingBottom: '100%' }}>
            <div className="absolute inset-0">
              <img src={MovieDetails.poster_url} className="w-full h-full object-cover aspect-content"/>
            </div>
          </div>
        </div>
        {/* Render slideshow */}
        <div className="flex-1 w-60 overflow-hidden">
          <div className="relative" style={{ paddingBottom: '100%' }}>
            <div className="absolute inset-0">
              <SlideShow
                images={[
                  MovieDetails.image1,
                  MovieDetails.image2,
                  MovieDetails.image3,
                  MovieDetails.image4,
                  MovieDetails.image5,
                ]}
                interval={2500}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Display release date */}
      <p className="text-gray-700 mt-4 mb-4">Release date: {formattedDate}</p>
      <div className="flex items-center">
        <ReactStarRatings
          rating={MovieDetails.rating}
          starRatedColor="#B8860B"
          starEmptyColor="black"
          starDimension="20px"
          starSpacing="2px"
        />
        <p className="text-gray-700 ml-2 mt-4 mb-4 text-sm">(Sign in to rate)</p>
      </div>
      {/* Display movie description */}
      <p className="text-gray-700 mt-5">{MovieDetails.description}</p>
    </div>
  );
};

export default MovieDetails;
