"use client"
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Definition of the Search component
export default function Search() {
  const [movies, setmovies] = useState<any[] | null>(null);  
  // The expression entered in the search field
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  // State of filtered movies
  const [filteredMovies, setFilteredMovies] = useState<any[]>([]);

  // Dynamic import to lazy load the movies with lazy loading
  const MovieComponent = dynamic(() => import('./MovieComponent'), { ssr: false });

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
          setmovies(extracted);
        } else {
          // Logging an error to the console in case of an error
          console.error('Error fetching movies:', response.statusText);
        }
      } catch (error) {
        // Logging an error to the console in case of an error
        console.error('An error occurred:', error);
      }
    };

    if (movies === null) {
      fetchData();
    }
    handleSearch();
  }, [searchTerm]); // The useEffect only runs when the searchTerm state changes

  // Handling the search
  function handleSearch() {
    if (searchTerm.trim() === '' || movies === null) {
      setFilteredMovies([]);
      return;
    }
    // Filtering movies based on the title
    const filtered = movies.filter((movie) => {
      return movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredMovies(filtered);
  }

  // Rendering the component
  return (
    <div className="text-center">
      <div className="relative flex flex-1 flex-shrink-0 mx-auto">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        {/* Input element for the search field */}
        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          placeholder={"🔎︎ Search for movies"}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div> 
      {/* Filtered movies can be displayed or utilized here */}
      <div>
        {filteredMovies.map((movie, index) => (
          <MovieComponent key={index} title={movie.title} imageUrl={movie.poster_url} rating={movie.rating}/>
        ))}
      </div>
    </div>
  );
}
