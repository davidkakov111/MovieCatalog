// Kötelező importok
"use client"
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic'; 
import Search from './components/search';
import { RowDataPacket } from 'mysql2';

const Otthon: React.FC = () => {
  // Állapot inicializálása a filmadatok tárolására
  const [filmData, setFilmData] = useState<RowDataPacket[] | null>(null);

  // Dinamikusan betöltött komponens a lazy loading megoldásához
  const FilmKomponens = dynamic(() => import('./components/filmkomponents'), { ssr: false });

  // useEffect hook használata a komponens mount-ja során a filmadatok lekérésére
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch kérés küldése az API-hoz
        const response = await fetch('/api/FilmTitles', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Ellenőrzés, hogy a kérés sikeres volt-e
        if (response.ok) {
          // JSON válasz beolvasása
          const jsres = await response.json();
          // Beolvasott adatok kinyerése és állapot frissítése
          const extracted = jsres.result as RowDataPacket[];
          setFilmData(extracted);
        } else {
          // Hiba esetén konzolra logolás
          console.error('Hiba az adatküldés során:', response.statusText);
        }
      } catch (error) {
        // Hiba esetén konzolra logolás
        console.error('Hiba történt:', error);
      }
    };

    // fetchData függvény hívása a komponens mount-ja során
    fetchData();
  }, []);

  // Ha még nincsenek betöltve az adatok, megjelenítünk egy betöltési üzenetet
  if (!filmData) {
    return <div>Betöltés...</div>;
  }

  // Ha vannak adatok, megjelenítjük a keresőt és a filmkomponenseket
  return (
    <div>
      <div className="mt-4 flex items-center justify-center gap-2 md:mt-8">
        <Search placeholder="Film kereső" extracted={filmData} />
      </div>
      <br />
      {/* Filmek megjelenítése a FilmKomponens segítségével */}
      {filmData.map((movie, index) => (
        <FilmKomponens key={index} title={movie.cim} />
      ))}
    </div>
  );
};

// A komponens exportálása
export default Otthon;
