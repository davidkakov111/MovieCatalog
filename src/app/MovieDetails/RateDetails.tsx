"use client"
import React, { useEffect, useState } from 'react';
import SlideShow from './SlideShow';
import { update_movie_review } from '../database/dbmethods';
import ReactStarRatings from 'react-star-ratings';
import CommentComponent from '../components/CommentComponent';
import { NewRating, SaveComment, WL_Modification, fetchWatchList } from './RDdependencies';

const RateMovie: React.FC<any> = ( UserID ) => {
  const [MovieDetails, setMovieDetails] = useState<any>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [MovieRating, setRating] = useState<number>(0);
  const [WatchListMovieIds, setWatchListMovieIds] = useState<number[]>([]);
  const [UserWatchList, setUserWatchList] = useState<any>('');
  const [userHasRated, setUserHasRated] = useState<boolean>(false);
  const [OriginalComments, setOriginalComments] = useState<any[]>([]);
  const [MovieComment, setComment] = useState<string>('');

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
      setOriginalComments(JSON.parse(movie.comments || '[]'))
      
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

    } catch (error) {
      console.error('Error occurred while fetching details about the movie:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch user watch list based on userID
  const fetchUserWatchList = async (userId: number) => {
    const result: string | any[] = await fetchWatchList(userId)

    // Check if the result is a string or an array.
    if (typeof result === "string") {
      alert(result); 
    } else {
      // If result is an array, update user watch list and watch list movie IDs.
      setUserWatchList(result[0]); 
      setWatchListMovieIds(result[1]); 
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title');

    // Fetch movie details and user watch list when component mounts
    if (title) {
      fetchAndUpdateMovieDetails(title);
      fetchUserWatchList(UserID.UserID);
    }
  }, []);

  // Handler for Watch List modification
  const handle_WL_Modification = async (add: boolean) => {
    const result: string | any[] = await WL_Modification(add, MovieDetails, UserWatchList, UserID.UserID);
    
    // Check if the result is a string or an array.
    if (typeof result === "string") {
        alert(result); 
    } else {
        // If result is an array, update user watch list and watch list movie IDs.
        setUserWatchList(result[0]); 
        setWatchListMovieIds(result[1]); 
    }
  }

  // Handler for new rating submission
  const handleNewRating = async (newRating: number) => {
    setUserHasRated(true);
    const result: string | number = await NewRating(newRating, UserID.UserID, MovieDetails)

    // Check if the result is a string or number.
    if (typeof result === "string") {
      setUserHasRated(false);
      alert(result);
    } else {
      setRating(result);
    }
  };

  const handleComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update the comment state with the value from the input field
    setComment(e.target.value);
  };

  const handleCommentSave = async () => {
    const result: string | any[] = await SaveComment(MovieComment, UserID.UserID, MovieDetails)

    // Check if the result is a string or array.
    if (typeof result === "string") {
      alert(result);
    } else {
      setOriginalComments(result)
    }
  }

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
      {/* Display release date and book mark*/}
      <div className="flex items-center">
        <p className="text-gray-700 mt-4 mb-4">Release date: {formattedDate}</p>
        {WatchListMovieIds.includes(MovieDetails.id)? (
          <img src="/bookmark_checkmark.png" alt="Watch list ✓" className="w-10 h-auto ml-auto" onClick={() => handle_WL_Modification(false)}/>
        ):(
          <img src="/bookmark_add.png" alt="Watch list +" className="w-10 h-auto ml-auto" onClick={() => handle_WL_Modification(true)}/>
        )}
      </div>
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
      {/* Input section for new comments */}
      <div className="flex items-center space-x-4 mt-5 mb-5">
        <input
          type="text"
          placeholder="Write a comment..."
          onChange={handleComment}
          className="w-25 md:w-25 px-2 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
          onClick={handleCommentSave}
        >
          Submit
        </button>
      </div>
      {/* Display the comment section */}
      <div className="bg-gray-200 p-6 rounded-lg shadow-md mt-5">
        <h2 className="text-black text-center text-2xl font-bold mb-4">Comment Section</h2>
        {OriginalComments.length > 0 ? (
          OriginalComments.map((comment, index) => (
            <CommentComponent key={index} comment={comment} />
          ))
        ) : (
          <p className="text-black text-center">Nothing to see here. Add a comment!</p>
        )}
      </div>
    </div>
  );
};

export default RateMovie;
