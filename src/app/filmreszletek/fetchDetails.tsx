"use client"
import React, { useEffect, useState } from 'react';
import SlideShow from './SlideShow';

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
        const film = data[0][0];
        const reviews = film.reviews + 1;

        // A jelenlegi idő pecsét
        const timestamp: number = Math.floor(Date.now() / 1000);

        if (film.review_dates === null) {
          // Még nem kapott ez a film megtekintést, ezért adok neki
          const dateArray = [timestamp];
          const review_dates = `[${dateArray.map(item => String(item)).join(', ')}]`;

          const Update_film_review = {
            "reviews": reviews,
            "review_dates": review_dates,
            "id": film.id,
          };

          // El küldöm a POST kérést a backend-nek
          const response = await fetch('/api/updateFilmReview', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(Update_film_review),
          });

          if (!response.ok) {
            alert("Nem sikerült elmenteni ennek a filmnek az új review-jét!");
          }
        } else {
          // Ez a film már kapott megtekintést
          // A string array-t visszaállítom 
          const reviewdates = eval(film.review_dates) as number[];
          reviewdates.push(timestamp);
          const review_dates = `[${reviewdates.map(item => String(item)).join(', ')}]`;

          const Update_film_review = {
            "reviews": reviews,
            "review_dates": review_dates,
            "id": film.id,
          };

          // El küldöm a POST kérést a backend-nek
          const response = await fetch('/api/updateFilmReview', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(Update_film_review),
          });

          if (!response.ok) {
            alert("Nem sikerült elmenteni ennek a filmnek az új review-jét!");
          }
        }

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
      <div className="flex">
        <div className="flex-1 w-60 overflow-hidden">
          <div className="relative" style={{ paddingBottom: '100%' }}>
            <div className="absolute inset-0">
              <img src={film_adatok.poszter_url} className="w-full h-full object-cover aspect-content"/>
            </div>
          </div>
        </div>
        <div className="flex-1 w-60 overflow-hidden">
          <div className="relative" style={{ paddingBottom: '100%' }}>
            <div className="absolute inset-0">
              <SlideShow
                images={[
                  film_adatok.kepek1,
                  film_adatok.kepek2,
                  film_adatok.kepek3,
                  film_adatok.kepek4,
                  film_adatok.kepek5,
                ]}
                interval={1000}
              />
            </div>
          </div>
        </div>
      </div>
      <p className="text-gray-700 mb-4">Megjelenés dátuma: {formattedDate}</p>
      <p className="text-gray-700 mb-4">A film átlag értékelése: {Math.round(film_adatok.ertekeles)}/100</p>
      <p className="text-gray-700 mb-4">{film_adatok.leiras}</p>
    </div>
  );
};

export default FilmReszletek;
