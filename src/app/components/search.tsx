"use client"
import { RowDataPacket } from 'mysql2';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Az interface létrehozása a Search komponens props-aihoz
interface SearchProps {
  placeholder: string; // A keresőmező helyére írandó szöveg
  extracted: RowDataPacket[]; // A filmek adatainak tömbje, ami a keresőmezőben szűrésre kerül
}

// A Search komponens definíciója
export default function Search({ placeholder, extracted }: SearchProps) {
  // Dinamikus importálás, hogy lazy loadingal legyen megoldva a filmek feltöltése  
  const FilmKomponens = dynamic(() => import('./filmkomponents'), { ssr: false }); 
  // A keresőmezőbe beírt kifejezés
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  // Szűrt filmek állapota
  const [filteredMovies, setFilteredMovies] = useState<RowDataPacket[]>([]); 
  useEffect(() => {
    handleSearch();
  }, [searchTerm]); // Az useEffect csak akkor fut le, ha a searchTerm állapota változik
  // A keresés kezelése
  function handleSearch() {
    if (searchTerm.trim() === '') {
      setFilteredMovies([]);
      return;
    }
    // A filmek szűrése a cím alapján
    const filtered = extracted.filter((movie: RowDataPacket) => {
      return movie.cim.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredMovies(filtered);
  }

  // A komponens megjelenítése
  return (
    <div className="text-center">
      <div className="relative flex flex-1 flex-shrink-0 mx-auto">
        <label htmlFor="search" className="sr-only">
          Keresés
        </label>
        {/* A keresőmező input eleme */}
        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* Itt megjeleníthetőek vagy felhasználhatóak a szűrt filmek */}
      <div>
        {filteredMovies.map((movie, index) => (
          <FilmKomponens key={index} title={movie.cim} />
        ))}
      </div>
    </div>
  );
}
