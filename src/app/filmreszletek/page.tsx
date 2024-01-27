"use client"
import React, { useEffect, useState } from 'react';

const fetchFilmDetails = async (cim:any) => {
  try {
    const response = await fetch(`/api/filmDetailsBycim?title=${encodeURIComponent(cim)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Hiba történt a film részleteinek lekérése közben:', error);
    return null;
  }
};

const FilmReszletek: React.FC = () => {
  const [filmDetails, setFilmDetails] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Olvassuk ki a címsort a böngésző címéből
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

  if (isLoading) {
    return <h1>Betöltés...</h1>;
  }

  if (!filmDetails) {
    return <h1>Nincsenek adatok a filmről!</h1>;
  }

  const film_adatok = filmDetails[0][0];
  const formattedDate = new Date(film_adatok.megjelenes_datuma).toLocaleDateString();

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-gray-100 rounded-md">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">{film_adatok.cim}</h2>
      <p className="text-gray-700 mb-4">Megjelenés dátuma: {formattedDate}</p>
      <p className="text-gray-700 mb-4">Értékelés: {film_adatok.ertekeles}</p>
      <p className="text-gray-700 mb-4">{film_adatok.leiras}</p>
    </div>
  );
};

export default FilmReszletek;