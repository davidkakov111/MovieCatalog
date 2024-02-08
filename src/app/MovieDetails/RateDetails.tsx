"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SlideShow from './SlideShow';
import { new_movie_rating } from '../database/dbmethods';
import { update_movie_review } from '../database/dbmethods';

// Interface
interface RateMovieProps {
  UserID: any;
}

// Function for fetching film details
const fetchFilmDetails = async (title: string) => {
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

// Function for updating rating
const UpdateRateing = async (update_rating: new_movie_rating) => {
  try {
    // Send a POST request to the backend
    const response = await fetch('/api/updateMovieRating', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(update_rating),
    });
    return response;
  } catch (error) {
    console.error('Error occurred while updating film rating:', error);
    return null;
  }
};

// Movie details component
const RateMovie: React.FC<RateMovieProps> = ({ UserID }) => {
  const router = useRouter();
  // Initialize state variables for movie details and loading status
  const [MovieDetails, setMovieDetails] = useState<any>('');
  const [isLoading, setIsLoading] = useState(true);
  // State for the input field value
  const [ratingInput, setRatingInput] = useState<number | string>('');

  // Effect for fetching movie details when the component mounts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title');

    const fetchData = async () => {
      if (!title) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await fetchFilmDetails(title);
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

        // Check if the movie has received reviews
        if (movie.review_dates === null) {
          // The movie has not received reviews yet
          const dateArray = [timestamp];
          const review_dates = `[${dateArray.map(item => String(item)).join(', ')}]`;
          const updateMovieReview: update_movie_review = {
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
            body: JSON.stringify(updateMovieReview),
          });

          if (!response.ok) {
            alert("Failed to save the new review for this movie!");
          }
        } else {
          // The movie has received reviews

          // Convert the string array back
          const reviewDates = eval(movie.review_dates) as number[];
          reviewDates.push(timestamp);
          const review_dates = `[${reviewDates.map(item => String(item)).join(', ')}]`;
          const updateMovieReview: update_movie_review = {
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
            body: JSON.stringify(updateMovieReview),
          });

          if (!response.ok) {
            alert("Failed to save the new review for this movie!");
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error occurred while fetching details about the movie:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Dependency array is empty, so the useEffect runs only once when the component mounts

  // Display loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-center">Loading...</h1>
      </div>
    );
  }

  // Display message if there are no movie details
  if (!MovieDetails || typeof MovieDetails === "string") {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-center">No data available for the movie!</h1>
      </div>
    );
  }
  
  // Prepare movie data
  const formattedDate = new Date(MovieDetails.release_date).toLocaleDateString();

  // Limit the rating range from 1 to 100
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = parseInt(e.target.value, 10);

    // Check within the range
    if (!isNaN(inputValue) && inputValue >= 1 && inputValue <= 100) {
      setRatingInput(inputValue);
    }
  };

  // Handle click event when submitting rating
  const handleClick = async () => {
    if (typeof ratingInput === 'string') {
      alert("Rating cannot be empty!");
    } else {
      // Current timestamp
      const timestamp: number = Math.floor(Date.now() / 1000);

      // Check if the movie has received ratings
      if (MovieDetails.rated_user_ids === null) {
        // The movie has not received ratings yet

        // New user id array with the user who submitted the rating
        const array = [UserID];
        const rated_user_id = `[${array.map(item => String(item)).join(', ')}]`;

        // New rate date array with the timestamp of the rating
        const dateArray = [timestamp];
        const rate_date = `[${dateArray.map(item => String(item)).join(', ')}]`;

        // Data for the API
        const update_rating: new_movie_rating = {
          id: MovieDetails.id as number,
          movie_rating: ratingInput,
          rated_user_ids: rated_user_id,
          rate_dates: rate_date,
        };

        // Update the rating
        const response = await UpdateRateing(update_rating);

        if (response !== null && response.ok) {
          // Redirect to the homepage on successful response
          router.push("/");
        } else {
          if (response !== null) {
            alert("Server error!");
          } else {
            alert('Error occurred while updating the movie rating!');
          }
        }
      } else {
        // Movie has received ratings

        // New rating
        const newRating = ratingInput;

        // Convert the string array back
        const rated_user_ids = eval(MovieDetails.rated_user_ids) as number[];

        // Number of ratings the movie has received
        const NrOfRatings = rated_user_ids.length;

        // New average rating of the movie
        const movie_rating = ((MovieDetails.rating * NrOfRatings) + newRating) / (NrOfRatings + 1);

        // Add the user id to the array to prevent multiple ratings for the same film
        rated_user_ids.push(UserID);

        // Convert the array back to a string to store in the database
        const RatedUserIds = `[${rated_user_ids.map(item => String(item)).join(', ')}]`;

        // Convert the string array back, which stores the dates of the ratings, and add the new one
        const ratedates = eval(MovieDetails.rate_dates) as number[];
        ratedates.push(timestamp);

        // Convert back to string array
        const rate_dates = `[${ratedates.map(item => String(item)).join(', ')}]`;

        // Data for the API
        const update_rating: new_movie_rating = {
          id: MovieDetails.id as number,
          movie_rating: movie_rating,
          rated_user_ids: RatedUserIds,
          rate_dates: rate_dates
        };
        // Update the rating
        const response = await UpdateRateing(update_rating);

        if (response !== null && response.ok) {
          // Redirect to the homepage on successful response
          router.push("/");
        } else {
          if (response !== null) {
            alert("Server error!");
          } else {
            alert('Error occurred while updating the movie rating!');
          }
        }
      }
    }
  };

  // Display movie details with rating option
  const renderFilmDetailsWithRating = () => (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-gray-300 rounded-md">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">{MovieDetails.title}</h2>
      <div className="flex">
        {renderImageSection()}
        {renderSlideShowSection()}
      </div>
      <p className="text-gray-700 mt-4 mb-4">Release date: {formattedDate}</p>
      <p className="text-gray-700">Average film rating: {renderAverageRating()}</p>
      {renderRatingInputSection()}
      <p className="text-gray-700 mt-5">{MovieDetails.description}</p>
    </div>
  );

  // Display movie details without rating option
  const renderFilmDetailsWithoutRating = () => (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-gray-300 rounded-md">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">{MovieDetails.title}</h2>
      <div className="flex">
        {renderImageSection()}
        {renderSlideShowSection()}
      </div>
      <p className="text-gray-700 mt-4 mb-4">Release date: {formattedDate}</p>
      <p className="text-gray-700">
        Average film rating: {renderAverageRating()} (You have already rated it once)
      </p>
      <p className="text-gray-700 mt-5">{MovieDetails.description}</p>
    </div>
  );

  // Display section with rating option
  const renderRatingInputSection = () => (
    <>
      <input
        type="number"
        min="1"
        max="100"
        placeholder="Rating"
        value={ratingInput}
        onChange={handleChange}
        className="mr-2 px-4 py-2 border border-gray-300 rounded"
      />
      <button
        className="bg-yellow-500 text-white px-4 py-2 rounded"
        onClick={handleClick}
      >
        Submit
      </button>
    </>
  );

  // Display average rating
  const renderAverageRating = () => (
    <>{Math.round(MovieDetails.rating)}/100</>
  );

  // Display image section
  const renderImageSection = () => (
    <div className="flex-1 w-60 overflow-hidden">
      <div className="relative" style={{ paddingBottom: '100%' }}>
        <div className="absolute inset-0">
          <img src={MovieDetails.poster_url} className="w-full h-full object-cover aspect-content"/>
        </div>
      </div>
    </div>
  );

  // Display slideshow section
  const renderSlideShowSection = () => (
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
            interval={3000}
          />
        </div>
      </div>
    </div>
  );

  // User IDs who have already rated
  const arrayFromStr = eval(MovieDetails.rated_user_ids) as number[];

  // Decide which detail section to display
  return MovieDetails.rated_user_ids === null
    ? renderFilmDetailsWithRating()
    : arrayFromStr.includes(UserID)
      ? renderFilmDetailsWithoutRating()
      : renderFilmDetailsWithRating();
};

export default RateMovie;
