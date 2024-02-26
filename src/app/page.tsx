// Mandatory imports
"use client"
import React, { useEffect, useState } from 'react';
import Search from './components/search';
import MovieComponent from './components/MovieComponent';
import { fetchMoviesByCategory } from './components/CategoryComponent';

const Home: React.FC = () => {
  // Initializing state to store movie data
  const [HotTopicMovieData, setHotTopicMovieData] = useState<any[] | null>(null);  
  const [moviesByCategory, setMoviesByCategory] = useState<{[key: string]: any[]}>({});

  // Movie categories
  const categories = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-fi'];
  
  // useEffect hook to fetch trending movie data during component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Sending a fetch request to the API
        const response = await fetch('/api/TrendingMovieDetails', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        // Checking if the request was successful
        if (response.ok) {
          // Parsing the JSON response
          const jsres = await response.json();
          const extracted = jsres.result as any[];
          setHotTopicMovieData(extracted);
        } else {
          const jsres = await response.json();
          const extracted = jsres.result;
          // Logging an error to the console in case of an error
          console.error('Error fetching movies:', extracted);
        }
      } catch (error) {
        // Logging an error to the console in case of an error
        console.error('An error occurred:', error);
      }
    };

    // Calling the fetchData function during component mount
    fetchData();
  }, []);

  // UseEffect to observe the intersection of category elements
  useEffect(() => {
    // Create a new IntersectionObserver
    const observer = new IntersectionObserver(handleIntersect, {
      root: null, // Observe the viewport
      rootMargin: '150px', // Add a 150px margin outside the viewport
      threshold: 0, // Call handleIntersect when target enters the viewport
    });

    // Iterate through each category
    categories.forEach(category => {
      // Get the DOM element for the category
      const target = document.getElementById(category);
      // If the target exists
      if (target) {
        // Start observing the target element
        observer.observe(target);
      }
    });

    // Cleanup function to disconnect the observer when component unmounts
    return () => {
      observer.disconnect();
    };
  }, [categories]); // Depend on categories for any changes

  // Function to handle intersection events
  const handleIntersect = async (entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      // If the observed element is intersecting with the viewport
      if (entry.isIntersecting) {
        // Get the category from the target element's id
        const category = entry.target.id;
        // If movies for this category haven't been fetched yet
        if (!moviesByCategory[category]) {
          // Fetch movies for this category
          fetchMovies(category);
        }
      }
    });
  };

  // Function to fetch movies by category
  const fetchMovies = async (category: string) => {
    const result = await fetchMoviesByCategory(category)
    if (typeof result === 'string') {
      console.error(result)
    } else {
      setMoviesByCategory(prevState => ({
        ...prevState,
        [category]: result,
      }));
    }
  };

  // If the trending movies have not yet been loaded, display a loading message
  if (!HotTopicMovieData) {
    return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-center">Loading...</h1>
    </div>
    )
  }

  // Display the search bar and movie components
  return (
    <div>
      <div className="mt-4 flex items-center justify-center gap-2 md:mt-8 flex-col">
        <Search/>
      </div>
      <br />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-black bg-opacity-15 rounded-lg p-4 flex flex-col items-center">
          {/* Adding a title */}
          <h2 className="text-2xl font-semibold mb-4 text-center text-yellow-500">Recently Trending</h2>
          {/* Displaying movies using the MovieComponent */}
          {HotTopicMovieData.map((movie, index) => (
            <MovieComponent key={index} title={movie.title} imageUrl={movie.poster_url} rating={movie.rating}/>
          ))}
        </div>
        <div className="bg-black bg-opacity-15 rounded-lg p-4 flex flex-col items-center min-h-[500px]">
          {/* Adding a title */}
          <h2 className="text-2xl font-semibold mb-4 text-center">Action</h2>
          {/* Displaying movies using the MovieComponent */}
          <div key={"Action"} id={"Action"}>
            <div className="movie-grid">
              {moviesByCategory["Action"]?.map((movie: any, index) => (
                <MovieComponent key={index} title={movie.title} imageUrl={movie.poster_url} rating={movie.rating} />
              ))}
            </div>
          </div>
        </div>
        <div className="bg-black bg-opacity-15 rounded-lg p-4 flex flex-col items-center min-h-[500px]">
          {/* Adding a title */}
          <h2 className="text-2xl font-semibold mb-4 text-center">Comedy</h2>
          {/* Displaying movies using the MovieComponent */}
          <div key={"Comedy"} id={"Comedy"}>
            <div className="movie-grid">
              {moviesByCategory["Comedy"]?.map((movie: any, index) => (
                <MovieComponent key={index} title={movie.title} imageUrl={movie.poster_url} rating={movie.rating} />
              ))}
            </div>
          </div>
        </div>
        <div className="bg-black bg-opacity-15 rounded-lg p-4 flex flex-col items-center min-h-[500px]">
          {/* Adding a title */}
          <h2 className="text-2xl font-semibold mb-4 text-center">Drama</h2>
          {/* Displaying movies using the MovieComponent */}
          <div key={"Drama"} id={"Drama"}>
            <div className="movie-grid">
              {moviesByCategory["Drama"]?.map((movie: any, index) => (
                <MovieComponent key={index} title={movie.title} imageUrl={movie.poster_url} rating={movie.rating} />
              ))}
            </div>
          </div>
        </div>
        <div className="bg-black bg-opacity-15 rounded-lg p-4 flex flex-col items-center min-h-[500px]">
          {/* Adding a title */}
          <h2 className="text-2xl font-semibold mb-4 text-center">Horror</h2>
          {/* Displaying movies using the MovieComponent */}
          <div key={"Horror"} id={"Horror"}>
            <div className="movie-grid">
              {moviesByCategory["Horror"]?.map((movie: any, index) => (
                <MovieComponent key={index} title={movie.title} imageUrl={movie.poster_url} rating={movie.rating} />
              ))}
            </div>
          </div>
        </div>
        <div className="bg-black bg-opacity-15 rounded-lg p-4 flex flex-col items-center min-h-[500px]">
          {/* Adding a title */}
          <h2 className="text-2xl font-semibold mb-4 text-center">Sci-fi</h2>
          {/* Displaying movies using the MovieComponent */}
          <div key={"Sci-fi"} id={"Sci-fi"}>
            <div className="movie-grid">
              {moviesByCategory["Sci-fi"]?.map((movie: any, index) => (
                <MovieComponent key={index} title={movie.title} imageUrl={movie.poster_url} rating={movie.rating} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Exporting the component
export default Home;
