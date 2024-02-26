import { update_user_WL, new_movie_rating, new_movie_comments } from "../database/dbmethods"

// Function to modify the user's watch list based on the parameters provided.
const WL_Modification = async (add: boolean, MovieDetails: any, UserWatchList: any, UserID: number) => {
    try {
        // Object representing the movie to be added or removed from the watch list.
        const this_movie = { id: MovieDetails.id, title: MovieDetails.title, poster_url: MovieDetails.poster_url, rating: MovieDetails.rating };
        
        let newWL = null;

        // If adding a movie to the watch list.
        if (add) {
            if (UserWatchList !== '') {
                UserWatchList.push(this_movie);
                newWL = UserWatchList;
            } else {
                newWL = [this_movie];
            }
        } else {
            // If removing a movie from the watch list.
            newWL = [];
            for (let i = 0; i < UserWatchList.length; i++) {
                if (UserWatchList[i].id !== this_movie.id) {
                    newWL.push(UserWatchList[i]);
                }
            }
        }
        
        // Prepare data for updating the user's watch list.
        const user: update_user_WL = {
            id: UserID,
            WL: JSON.stringify(newWL),
        }

        // Update the watch list by sending a request to the backend API.
        const response = await fetch('/api/updateUserWL', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });

        // Handle the response from the backend.
        if (response.ok) {
            let WatchListIDs: number[] = [];
            for (const movie of newWL) {
                WatchListIDs.push(movie.id);
            }
            return [newWL, WatchListIDs];
        } else {
            return 'Server error! Error occurred while updating your watch list!';
        }
    } catch (error) {
        // Log and return an error message if an error occurs.
        console.error('Error occurred while updating your watch list:', error);
        return "Error occurred while updating your watch list!";
    }
};

// Function to handle new rating submission
const NewRating = async (newRating: number, UserID: number, MovieDetails: any) => {
    try {
        const timestamp = Math.floor(Date.now() / 1000);

        // Parse rated user IDs from movie details or initialize as an empty array
        const rated_user_ids = JSON.parse(MovieDetails?.rated_user_ids || '[]');
        // Add current user's ID to rated user IDs
        rated_user_ids.push(UserID);

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
        return movie_rating;
        } else {
        return 'Server error! Error occurred while updating the movie rating!';
        }
    } catch (error) {
        // Log error message if an error occurs
        console.error('Error occurred while updating the rating:', error);
        return "Error occurred while updating the rating!";
    }
};

// Function to save the comment
const SaveComment = async (MovieComment: string, UserID: number, MovieDetails: any) => {
    // Check if the movie comment is empty or contains only whitespace
    if (MovieComment === '' || /^\s*$/.test(MovieComment)) {
      return "Comment can't be empty!";
    }
  
    // Create a new comment array containing the UserID and the movie comment
    const new_comment = [UserID, MovieComment];
  
    // Parse the existing comments from the MovieDetails object or initialize an empty array
    const comments = JSON.parse(MovieDetails?.comments || '[]');
  
    // Push the new comment into the existing comments array
    comments.push(new_comment);
  
    // Prepare the payload with updated comments
    const movie_comments: new_movie_comments = {
      id: MovieDetails.id as number,
      comments: JSON.stringify(comments),
    };
  
    // Send a POST request to the backend API to update movie comments
    const response = await fetch('/api/updateMovieComments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(movie_comments),
    });
  
    // Check if the request was successful
    if (response.ok) {
        return comments;
    } else {
      return 'Error occurred while updating the movie comments!';
    }
}

// Function to fetch user watch list based on userID
const fetchWatchList = async (userID: number) => {
    try {
        // Fetch data from the backend API
        const response = await fetch('/api/getUserWatchList', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userID),
        });

        // Parse the response data
        const data = await response.json();
        const watch_list = data?.result;

        // Handle response from backend
        if (response.ok) {
            // Parse the watch list data
            const realWatchList = JSON.parse(watch_list);

            // Check if parsed watch list data is not null
            if (realWatchList !== null) {
                let WatchListIDs: number[] = []
                // Extract IDs of movies from the watch list
                for (const movie of realWatchList) {
                    WatchListIDs.push(movie.id)
                };
                return [realWatchList, WatchListIDs];
            };
            return [[], []];
        } else {
            return 'Server error! Error occurred while fetching watch list!';
        };
    } catch (error) {
        // Log error message if an error occurs
        console.error('Error occurred while fetching watch list:', error);
        return 'Error occurred while fetching watch list';
    };
};

export { WL_Modification, NewRating, SaveComment, fetchWatchList };
