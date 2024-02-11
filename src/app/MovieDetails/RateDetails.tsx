"use client"
import React, { useEffect, useState } from 'react';
import SlideShow from './SlideShow';
import { new_movie_rating } from '../database/dbmethods';
import { update_movie_review } from '../database/dbmethods';
import ReactStarRatings from 'react-star-ratings';

const RateMovie: React.FC<any> = ( UserID ) => {
  const [MovieDetails, setMovieDetails] = useState<any>('');
  const [isLoading, setIsLoading] = useState(true);
  const [MovieRating, setRating] = useState<number>(0);
  const [userHasRated, setUserHasRated] = useState<boolean>(false);

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

      // Set movie details and rating
      setMovieDetails(movie);
      setRating(movie.rating);
      
      // Check if the current user has already rated the movie
      if (JSON.parse(movie.rated_user_ids)?.includes(UserID.UserID)) {
        setUserHasRated(true);
      }

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

  // Function to handle new rating submission
  const handleNewRating = async (newRating: number) => {
    setUserHasRated(true);
    const timestamp = Math.floor(Date.now() / 1000);

    // Parse rated user IDs from movie details or initialize as an empty array
    const rated_user_ids = JSON.parse(MovieDetails?.rated_user_ids || '[]');
    // Add current user's ID to rated user IDs
    rated_user_ids.push(UserID.UserID);

    const NrOfRatings = rated_user_ids.length;
    const movie_rating = ((MovieDetails.rating || 0) * (NrOfRatings - 1) + newRating) / (NrOfRatings);
    
    // Prepare data for updating movie rating
    const update_rating: new_movie_rating = {
      id: MovieDetails.id as number,
      movie_rating: movie_rating,
      rated_user_ids: JSON.stringify(rated_user_ids),
      rate_dates: JSON.stringify([...(JSON.parse(MovieDetails?.rate_dates || '[]')), timestamp]),
    };

    // Send update request to backend
    const response = await fetch('/api/updateMovieRating', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update_rating),
    });

    // Handle response from backend
    if (response.ok) {
      setRating(movie_rating);
    } else {
      setUserHasRated(false);
      alert('Server error! Error occurred while updating the movie rating!');
    }
  };
  
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
      {/* Render star ratings */}
      {userHasRated ? (
        <div className="flex items-center">
          <ReactStarRatings
            rating={MovieRating}
            starRatedColor="#B8860B"
            starEmptyColor="black"
            starDimension="20px"
            starSpacing="2px"
          />
          <p className="text-gray-700 ml-2 mt-4 mb-4 text-sm">(Rated)</p>
        </div>
      ) : (
        <div className="flex items-center">
          <ReactStarRatings
            rating={MovieRating}
            starRatedColor="#B8860B"
            starEmptyColor="black"
            starDimension="20px"
            starSpacing="2px"
            changeRating={handleNewRating}
          />
          <p className="text-gray-700 ml-2 mt-4 mb-4 text-sm">(Rate once, choose one star.)</p>
        </div>
      )}
      {/* Display movie description */}
      <p className="text-gray-700 mt-5">{MovieDetails.description}</p>
    </div>
  );
};

export default RateMovie;
