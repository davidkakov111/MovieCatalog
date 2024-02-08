// Mandatory imports
"use client"
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic'; 
import Search from './components/search';

const Home: React.FC = () => {
  // Initializing state to store movie data
  const [MovieData, setMovieData] = useState<any[] | null>(null);
  const [HotTopicMovieData, setHotTopicMovieData] = useState<any[] | null>(null);
  const [ActionMovieData, setActionMovieData] = useState<any[] | null>(null);
  const [ComedyMovieData, setComedyMovieData] = useState<any[] | null>(null);
  const [DramaMovieData, setDramaMovieData] = useState<any[] | null>(null);
  const [HorrorMovieData, setHorrorMovieData] = useState<any[] | null>(null);
  const [ScifiMovieData, setScifiMovieData] = useState<any[] | null>(null);
  
  // Dynamically loaded component for lazy loading
  const MovieComponent = dynamic(() => import('./components/MovieComponent'), { ssr: false });
  // useEffect hook to fetch movie data during component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Sending a fetch request to the API
        const response = await fetch('/api/getAllMovie', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        // Checking if the request was successful
        if (response.ok) {
          // Parsing the JSON response
          const jsres = await response.json();

          // Extracting and updating the state with the fetched data
          const extracted = jsres.result as any[];
          setMovieData(extracted);

          // Filtering based on category
          const actionMovies = extracted.filter(film => film.category === "Action");
          setActionMovieData(actionMovies)
          const comedyMovies = extracted.filter(film => film.category=== "Comedy");
          setComedyMovieData(comedyMovies)
          const dramaMovies = extracted.filter(film => film.category === "Drama");
          setDramaMovieData(dramaMovies)
          const horrorMovies = extracted.filter(film => film.category === "Horror");
          setHorrorMovieData(horrorMovies)
          const scifiMovies = extracted.filter(film => film.category === "Sci-fi");
          setScifiMovieData(scifiMovies)

          // Current timestamp
          const timestamp: number = Math.floor(Date.now() / 1000);
          // Deadline for timestamps within the last week
          const weekDeadline = timestamp - 604800;

          // Hotfilms includes the number of views of movies last week, to which 
          // I add the number of reviews of last week multiplied by 5, getting a 
          // realistic picture of movies that have attracted users' attention the most
          const HotMovies = extracted.map((movie) => {
            const reviewDatesCount = movie.review_dates
              ? movie.review_dates
                  .replace("[", "")
                  .replace("]", "")
                  .split(", ")
                  .filter((date: string) => parseInt(date, 10) > weekDeadline).length
              : 0;
            const rateDatesCount = movie.rate_dates
              ? movie.rate_dates
                  .replace("[", "")
                  .replace("]", "")
                  .split(", ")
                  .filter((date: string) => parseInt(date, 10) > weekDeadline).length
              : 0;
            return {
              movie,
              HotTopicIndex: reviewDatesCount + (rateDatesCount * 5),
            };
          });

          // Movies based on popularity index, in descending order
          HotMovies.sort((a, b) => b.HotTopicIndex - a.HotTopicIndex);
          
          // Selecting the top 5 movies based on popularity index
          const top5Movies = HotMovies.slice(0, 5).map((item) => item.movie);
          setHotTopicMovieData(top5Movies)
        } else {
          // Logging an error to the console in case of an error
          console.error('Error fetching movies:', response.statusText);
        }
      } catch (error) {
        // Logging an error to the console in case of an error
        console.error('An error occurred:', error);
      }
    };

    // Calling the fetchData function during component mount
    fetchData();
  }, []);

  // If the data is not yet loaded, display a loading message
  if (!ActionMovieData || !ComedyMovieData || !DramaMovieData || !HorrorMovieData || !ScifiMovieData || !MovieData || !HotTopicMovieData) {
    return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-center">Loading...</h1>
    </div>
    )
  }

  // If there is data, display the search bar and movie components
  return (
    <div>
      <div className="mt-4 flex items-center justify-center gap-2 md:mt-8    flex-col">
        <Search placeholder="🔎︎ Search for movies" extracted={MovieData} />
      </div>
      <br />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-black bg-opacity-15 rounded-lg p-4 flex flex-col items-center">
          {/* Adding a title */}
          <h2 className="text-2xl font-semibold mb-4 text-center text-yellow-500">Recently Trending</h2>
          {/* Displaying movies using the MovieComponent */}
          {HotTopicMovieData.map((movie, index) => (
            <MovieComponent key={index} title={movie.title} imageUrl={movie.poster_url}/>
          ))}
        </div>
        <div className="bg-black bg-opacity-15 rounded-lg p-4 flex flex-col items-center">
          {/* Adding a title */}
          <h2 className="text-2xl font-semibold mb-4 text-center">Action</h2>
          {/* Displaying movies using the MovieComponent */}
          {ActionMovieData.map((movie, index) => (
            <MovieComponent key={index} title={movie.title} imageUrl={movie.poster_url}/>
          ))}
        </div>
        <div className="bg-black bg-opacity-15 rounded-lg p-4 flex flex-col items-center">
          {/* Adding a title */}
          <h2 className="text-2xl font-semibold mb-4 text-center">Comedy</h2>
          {/* Displaying movies using the MovieComponent */}
          {ComedyMovieData.map((movie, index) => (
            <MovieComponent key={index} title={movie.title} imageUrl={movie.poster_url}/>
          ))}
        </div>
        <div className="bg-black bg-opacity-15 rounded-lg p-4 flex flex-col items-center">
          {/* Adding a title */}
          <h2 className="text-2xl font-semibold mb-4 text-center">Drama</h2>
          {/* Displaying movies using the MovieComponent */}
          {DramaMovieData.map((movie, index) => (
            <MovieComponent key={index} title={movie.title} imageUrl={movie.poster_url}/>
          ))}
        </div>
        <div className="bg-black bg-opacity-15 rounded-lg p-4 flex flex-col items-center">
          {/* Adding a title */}
          <h2 className="text-2xl font-semibold mb-4 text-center">Horror</h2>
          {/* Displaying movies using the MovieComponent */}
          {HorrorMovieData.map((movie, index) => (
            <MovieComponent key={index} title={movie.title} imageUrl={movie.poster_url}/>
          ))}
        </div>
        <div className="bg-black bg-opacity-15 rounded-lg p-4 flex flex-col items-center">
          {/* Adding a title */}
          <h2 className="text-2xl font-semibold mb-4 text-center">Sci-fi</h2>
          {/* Displaying movies using the MovieComponent */}
          {ScifiMovieData.map((movie, index) => (
            <MovieComponent key={index} title={movie.title} imageUrl={movie.poster_url}/>
          ))}
        </div>
      </div>
    </div>
  );
};

// Exporting the component
export default Home;
