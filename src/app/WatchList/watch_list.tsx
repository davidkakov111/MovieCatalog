// Imported packages
"use client"
import React, { useState, useEffect } from 'react';
import {fetchWatchList } from '../MovieDetails/RDdependencies';
import MovieComponent from '../components/MovieComponent';

// Watchlist component
const Watchlist = (UserID: any) => {
    const [WatchList, setWatchList] = useState<any[]>([]);
    const [bool, setbool] = useState<boolean>(false);

    // Function to fetch watch list based on userID
    const fetchUserWatchList = async (userId: number) => {
        const result: string | any[] = await fetchWatchList(userId)

        // Check if the result is a string or an array.
        if (typeof result === "string") {
            alert(result); 
        } else {
        // If result is an array, then save the watch list.
        setWatchList(result[0]); 
        }
    };
  
    // useEffect hook running on component mount
    useEffect(() => {
        fetchUserWatchList(UserID.UserID)
        setbool(true)
    }, []); 

    if (!bool) {
        return <div className="flex items-center justify-center h-screen"><h1 className="text-center">Loading...</h1></div>;
    }

    // Watch list component
    return (
        <div className="bg-black bg-opacity-15 rounded-lg p-4 min-h-[500px]">
            <h2 className="text-2xl font-semibold mb-4 text-center">Watch List</h2>
            {WatchList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center">
                    {WatchList.map((movie: any, index) => (
                        <div key={index} className="flex justify-center">
                            <MovieComponent title={movie.title} imageUrl={movie.poster_url} rating={movie.rating} />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-xl mt-20 text-center">No movies in the watch list.</p>
            )}
        </div>
    );
};

// Exporting the Watchlist component
export default Watchlist;
