"use client"
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Creating the interface for the props of the Search component
interface SearchProps {
  placeholder: string; // Text to be displayed in the search field
  extracted: any[]; // Array of movie data to be filtered in the search field
}

// Definition of the Search component
export default function Search({ placeholder, extracted }: SearchProps) {

  // Dynamic import to lazy load the movies with lazy loading
  const FilmComponent = dynamic(() => import('./MovieComponent'), { ssr: false });

  // The expression entered in the search field
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  // State of filtered movies
  const [filteredMovies, setFilteredMovies] = useState<any[]>([]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm]); // The useEffect only runs when the searchTerm state changes

  // Handling the search
  function handleSearch() {
    if (searchTerm.trim() === '') {
      setFilteredMovies([]);
      return;
    }
    // Filtering movies based on the title
    const filtered = extracted.filter((movie) => {
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
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* Filtered movies can be displayed or utilized here */}
      <div>
        {filteredMovies.map((movie, index) => (
          <FilmComponent key={index} title={movie.title} imageUrl={movie.poster_url}/>
        ))}
      </div>
    </div>
  );
}
