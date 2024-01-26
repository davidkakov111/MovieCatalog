// Kötelező importok
import React from 'react';
import dynamic from 'next/dynamic';
import { getfilmbycim } from './database/dbmuveletek';
import { RowDataPacket } from 'mysql2';

export default async function Otthon() {
  // Dinamikusan betöltöm a komponenst lazy loadinggal
  const FilmKomponens = dynamic(() => import('./filmkomponens'), { ssr: false });
  
  // Filmek címeinek lekérése az adatbázisból
  const result = await getfilmbycim();

  // Ha vannak címek, kicsomagolom őket és kilistázom a FilmKomponensben
  if (result !== null) {
    const extracted = result[0] as RowDataPacket[];
    return (
      <div>
        <ul>
          {extracted.map((movie, index) => (
            <FilmKomponens key={index} title={movie.cim} />
          ))}
        </ul>
      </div>
    );
  } else {
    // Ha nincsenek filmek, megfelelő üzenet megjelenítése
    return (
      <div>
        <h1>Nincsenek filmek!</h1>
      </div>
    );
  }
}
