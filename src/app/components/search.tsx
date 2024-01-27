'use client'
import { RowDataPacket } from 'mysql2';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

interface SearchProps {
  placeholder: string;
  extracted: RowDataPacket[];
}

export default function Search({ placeholder, extracted }: SearchProps) {
  const FilmKomponens = dynamic(() => import('../components/filmkomponens'), { ssr: false });

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredMovies, setFilteredMovies] = useState<RowDataPacket[]>([]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm]); // Az useEffect csak akkor fut le, ha a searchTerm változik

  function handleSearch() {
    if (searchTerm.trim() === '') {
      setFilteredMovies([]);
      return;
    }

    const filtered = extracted.filter((movie: RowDataPacket) => {
      return movie.cim.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredMovies(filtered);
  }

  return (
    <div className="text-center">
      <div className="relative flex flex-1 flex-shrink-0 mx-auto">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* Itt felhasználhatod vagy megjelenítheted a szűrt filmeket */}
      <div>
        {filteredMovies.map((movie, index) => (
          <FilmKomponens key={index} title={movie.cim} />
        ))}
      </div>
    </div>
  );
}