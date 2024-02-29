// Mandatory imports
"use client"
import React, { useEffect, useState } from 'react';
import Search from './components/search';
import MovieComponent from './components/MovieComponent';
import { fetchMoviesByCategory, fetchHotMovies } from './components/CategoryComponent';

const Home: React.FC = () => {
  const NrOfMoviesPerCategory = 10
  // Initializing state to store movie data 
  const [moviesByCategory, setMoviesByCategory] = useState<{[key: string]: any[]}>({});
  const [currentPage, setCurrentPage] = useState<{ [key: string]: number }>({
    "Action": 1,
    "Comedy": 1,
    "Drama": 1,
    "Horror": 1,
    "Sci-fi": 1,
  });

  // Movie categories
  const categories = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-fi'];
  
  // useEffect hook to fetch trending movie data during component mount
  useEffect( () => {
    const fetchData = async () => {
      const result = await fetchHotMovies(NrOfMoviesPerCategory)
      if (result === "Movie details are not available") {
        alert("We don't have any more movies.")
      } else if (typeof result === 'string') {
        console.error(result)
      } else {
        setMoviesByCategory(prevState => ({
          ...prevState,
          ["Trending"]: result,
        }));
      }
    }
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
          fetchMovies(category, 1);
        }
      }
    });
  };

  // Function to fetch movies by category
  const fetchMovies = async (category: string, wantPage: number) => {
    const result = await fetchMoviesByCategory(category, wantPage, NrOfMoviesPerCategory)
    if (result === "Movie details are not available") {
      alert(`We don't have any more ${category} movies.`)
    } else if (typeof result === 'string') {
      console.error(result)
    } else {
      setMoviesByCategory(prevState => ({
        ...prevState,
        [category]: result,
      }));
      setCurrentPage((prevCurrentPage) => ({
        ...prevCurrentPage,
        [category]: wantPage,
      }));
    }
  };

  // If the trending movies have not yet been loaded, display a loading message
  if (!moviesByCategory["Trending"]) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-center">Loading...</h1>
      </div>
    )
  };

  // Display the search bar and movie components
  return (
    <div>
      <div className="mt-4 flex items-center justify-center gap-2 md:mt-8 flex-col">
        {/* Search component */}
        <Search />
      </div>
      <br />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-black bg-opacity-15 rounded-lg p-4 flex flex-col items-center">
          {/* Adding a title */}
          <h2 className="text-2xl font-semibold mb-4 text-center text-yellow-500">Recently Trending</h2>
          {/* Displaying movies using the MovieComponent */}
          {moviesByCategory["Trending"]?.map((movie: any, index: number) => (
            <MovieComponent key={index} title={movie.title} imageUrl={movie.poster_url} rating={movie.rating}/>
          ))}
        </div>
        {/* Render each category */}
        {categories.map((category) => (
          <div className="bg-black bg-opacity-15 rounded-lg p-4 flex flex-col items-center min-h-[500px]" key={category}>
            <h2 className="text-2xl font-semibold mb-4 text-center">{category}</h2>
            <div key={category} id={category}>
              <div className="movie-grid">
                {moviesByCategory[category]?.map((movie: any, index: number) => (
                  <MovieComponent key={index} title={movie.title} imageUrl={movie.poster_url} rating={movie.rating} />
                ))}
              </div>
            </div>
            <div>
              <button onClick={() => fetchMovies(category, (currentPage[category]-1))} disabled={currentPage[category] === 1} className="text-gray-600 hover:text-gray-800 focus:outline-none text-3xl mr-4 px-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors duration-300">
                ←
              </button>
              {currentPage[category]}
              <button onClick={() => fetchMovies(category, (currentPage[category]+1))} className="text-gray-600 hover:text-gray-800 focus:outline-none text-3xl ml-4 px-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors duration-300">
                →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Exporting the component
export default Home;
