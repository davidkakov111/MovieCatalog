// Kötelező importok
import React from 'react';
import dynamic from 'next/dynamic';
import { getfilmbycim } from './database/dbmuveletek';
import { RowDataPacket } from 'mysql2';
import Search from './components/search';

export default async function Otthon() {
  // Dinamikusan betöltöm a komponenst lazy loadinggal
  const FilmKomponens = dynamic(() => import('./components/filmkomponens'), { ssr: false });
  
  // Filmek címeinek lekérése az adatbázisból
  const result = await getfilmbycim();

  // Ha vannak címek, kicsomagolom őket és kilistázom a FilmKomponensben
  if (result !== null) {
    const extracted = result[0] as RowDataPacket[];
    return (
      <div>
        <div className="mt-4 flex items-center justify-center gap-2 md:mt-8">
          <Search placeholder="Search..." extracted={extracted} />
          {/* <CreateInvoice /> */}
        </div>
        <br />
        {extracted.map((movie, index) => (
          <FilmKomponens key={index} title={movie.cim} />
        ))}
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
