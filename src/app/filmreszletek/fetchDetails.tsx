"use client"
import React, { useEffect, useState } from 'react';

// Az adatok lekérdezésére szolgáló függvény
const fetchFilmDetails = async (cim: any) => {
  try {
    const response = await fetch(`/api/filmDetailsBycim?title=${encodeURIComponent(cim)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Hiba történt a film részleteinek lekérése közben:', error);
    return null;
  }
};

// Film részletek komponens
const FilmReszletek: React.FC = () => {
  // Állapotváltozók inicializálása a film adataival és betöltés állapotával
  const [filmDetails, setFilmDetails] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Effektus a komponens mount-jakor, amely lekéri a film részleteit
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cim = urlParams.get('title');

    const fetchData = async () => {
      if (!cim) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await fetchFilmDetails(cim);
        setFilmDetails(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Hiba történt a film részleteinek lekérése közben:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // A dependency tömb üres, így a useEffect csak egyszer fut le, a komponens mount-jakor

  // Betöltési állapot megjelenítése
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-center">Betöltés...</h1>
      </div>
    );
  }

  // Ha nincsenek adatok, akkor üzenet megjelenítése
  if (!filmDetails) {
    return <h1>Nincsenek adatok a filmről!</h1>;
  }

  // Film adatainak előkészítése
  const film_adatok = filmDetails[0][0];
  const formattedDate = new Date(film_adatok.megjelenes_datuma).toLocaleDateString();
  // Film részletek megjelenítése
  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-gray-300 rounded-md">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">{film_adatok.cim}</h2>
      <img className="w-full h-auto" src={film_adatok.poszter_url} alt={film_adatok.cim} />
      <p className="text-gray-700 mb-4">Megjelenés dátuma: {formattedDate}</p>
      <p className="text-gray-700 mb-4">A film átlag értékelése: {Math.round(film_adatok.ertekeles)}/100</p>
      <p className="text-gray-700 mb-4">{film_adatok.leiras}</p>
    </div>
  );
};

export default FilmReszletek;