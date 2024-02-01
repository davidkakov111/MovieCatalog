"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

// Az rateing frissítésére szolgáló függvény
const UpdateRateing = async (update_rateing: any) => {
    try {
        // El küldöm a POST kérést a backend-nek
        const response = await fetch('/api/updateFilmRateing', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(update_rateing),
        });
        return response;
    } catch (error) {
        console.error('Hiba történt a film részleteinek lekérése közben:', error);
        return null;
    }
};

// Props a RateFilmReszletek komponensnek
interface RateFilmReszletekProps {
    UserID: any;
  }

// Film részletek komponens
const RateFilmReszletek: React.FC<RateFilmReszletekProps> = ({ UserID }) => {
  const router = useRouter();
  // Állapotváltozók inicializálása a film adataival és betöltés állapotával
  const [filmDetails, setFilmDetails] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Az input mező értékének állapota
  const [ertekelesInput, setErtekelesInput] = useState<number | string>(''); 

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
        const film = data[0][0];
        const reviews = film.reviews + 1
        // A jelenlegi idő pecsét
        const timestamp: number = Math.floor(Date.now() / 1000);
        if (film.review_dates === null) {
          // Még nem kapott ez a film megtekintést
          const dateArray = [timestamp];
          const review_dates = `[${dateArray.map(item => String(item)).join(', ')}]`;
          const Update_film_review = {
            "reviews": reviews,
            "review_dates": review_dates,
            "id": film.id,
          }
          // El küldöm a POST kérést a backend-nek
          const response = await fetch('/api/updateFilmReview', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(Update_film_review),
          });
          if (!response.ok) {
            alert("Nem sikerült elmenteni ennek a filmnek az új review-jét!")
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
          }
          // El küldöm a POST kérést a backend-nek
          const response = await fetch('/api/updateFilmReview', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(Update_film_review),
          });
          if (!response.ok) {
            alert("Nem sikerült elmenteni ennek a filmnek az új review-jét!")
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

  // Ha nincsenek adatok a filmől, akkor közlöm 
  if (!filmDetails) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-center">Nincsenek adatok a filmről!</h1>
      </div>
    );
  }

  // Film adatainak előkészítése
  const film_adatok = filmDetails[0][0];
  const formattedDate = new Date(film_adatok.megjelenes_datuma).toLocaleDateString();

  // Itt limitálom le az értékelési tartományt 1 - 100-ig
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = parseInt(e.target.value, 10);

    // Ellenőrzés a tartományon belül
    if (!isNaN(inputValue) && inputValue >= 1 && inputValue <= 100) {
    setErtekelesInput(inputValue);
    }
  };

  // Értékelés beküldése esetén
  const handleClick = async () => {
    if (ertekelesInput === '') {
      alert("Az értékelés nem lehet üres!")
    } else {
      // A jelenlegi idő pecsét
      const timestamp: number = Math.floor(Date.now() / 1000);
      if (film_adatok.rated_user_ids === null) {
        // Még nem kapott ez a film értékelést
        // Az új user id tömb, amiben az értékeléseiket leadott felhasználók szerepelnek
        const Array = [UserID];
        const rated_user_ids = `[${Array.map(item => String(item)).join(', ')}]`;
        // Az új rate dates array, amiben az értékelések leadásának időpontjai szerepelnek
        const dateArray = [timestamp];
        const rate_dates = `[${dateArray.map(item => String(item)).join(', ')}]`;

        // Adat az API számára
        const update_rateing = {
          film_id: film_adatok.id,
          film_ertekeles: ertekelesInput,
          film_rated_user_ids: rated_user_ids,
          rate_dates: rate_dates,
        };

        // Frissítem az értékelést
        const response = await UpdateRateing(update_rateing)

        if (response !== null &&  response.ok) {
          // Sikeres válasz esetén a főoldalra irányítom a felhasználót
          router.push("/")
        } else {
          if (response !== null) {
              alert("Server error!")
          } else {
              alert('Hiba történt a film értékelésének frissítése közben!')
          }
        }
      } else {
        // Ennek a filmnek már vannak értékelései

        // Új értékelés
        const UjErtekeles: any = ertekelesInput

        // A string tömböt visszaállítom 
        const rated_user_ids = eval(film_adatok.rated_user_ids) as number[];

        // "NrOfRatings" alkalommal kapott értékelést a film
        const NrOfRatings = rated_user_ids.length;

        // A film új átlag értékelése
        const film_ertekeles = ((film_adatok.ertekeles * NrOfRatings) + UjErtekeles) / (NrOfRatings + 1)
        
        // Az értékelő felhasználó id-ját is belteszem a többi közé, hogy kétszer ne tudjon egy filmet értékelni
        rated_user_ids.push(UserID);

        // Viszaállítom az arrayt stringé hogy elmenthessem az adatbázisba
        const RatedUserIds = `[${rated_user_ids.map(item => String(item)).join(', ')}]`;

        // A string tömböt visszaállítom, ami az értékelések datumát menti és belerakom az újat
        const ratedates = eval(film_adatok.rate_dates) as number[];
        ratedates.push(timestamp);

        // Visszaállítom string tömbé
        const rate_dates = `[${ratedates.map(item => String(item)).join(', ')}]`;

        // Összeállított adat az API számára
        const update_rateing = {
            film_id: film_adatok.id,
            film_ertekeles: film_ertekeles,
            film_rated_user_ids: RatedUserIds,
            rate_dates: rate_dates,
        }
        const response = await UpdateRateing(update_rateing)
        if (response !== null &&  response.ok) {
          // Sikeres válasz esetén a főoldalra irányítom a felhasználót
          router.push("/")
        } else {
            if (response !== null) {
                alert("Server error!")
            } else {
                alert('Hiba történt a film értékelésének frissítése közben!')
            }
        }
      }
    }
  };

  // Film részletek megjelenítése értékelés opcióval
  const renderFilmDetailsWithRating = () => (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-gray-300 rounded-md">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">{film_adatok.cim}</h2>
      <div className="flex">
        {renderImageSection()}
        {renderSlideShowSection()}
      </div>
      <p className="text-gray-700 mt-4 mb-4">Megjelenés dátuma: {formattedDate}</p>
      <p className="text-gray-700">A film átlag értékelése: {renderAverageRating()}</p>
      {renderRatingInputSection()}
      <p className="text-gray-700 mt-5">{film_adatok.leiras}</p>
    </div>
  );

  // Film részletek megjelenítése értékelés opció nélkül
  const renderFilmDetailsWithoutRating = () => (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-gray-300 rounded-md">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">{film_adatok.cim}</h2>
      <div className="flex">
        {renderImageSection()}
        {renderSlideShowSection()}
      </div>
      <p className="text-gray-700 mt-4 mb-4">Megjelenés dátuma: {formattedDate}</p>
      <p className="text-gray-700">
        A film átlag értékelése: {renderAverageRating()} (Te már egyszer értékelted)
      </p>
      <p className="text-gray-700 mt-5">{film_adatok.leiras}</p>
    </div>
  );

  // Értékelés opcióval rendelkező rész megjelenítése
  const renderRatingInputSection = () => (
    <>
      <input
        type="number"
        min="1"
        max="100"
        placeholder="Értékelés"
        value={ertekelesInput}
        onChange={handleChange}
        className="mr-2 px-4 py-2 border border-gray-300 rounded"
      />
      <button
        className="bg-yellow-500 text-white px-4 py-2 rounded"
        onClick={handleClick}
      >
        Beküld
      </button>
    </>
  );

  // Átlagos értékelés megjelenítése
  const renderAverageRating = () => (
    <>{Math.round(film_adatok.ertekeles)}/100</>
  );

  // Kép megjelenítéséért felelős rész
  const renderImageSection = () => (
    <div className="flex-1 w-60 overflow-hidden">
      <div className="relative" style={{ paddingBottom: '100%' }}>
        <div className="absolute inset-0">
          <img src={film_adatok.poszter_url} className="w-full h-full object-cover aspect-content"/>
        </div>
      </div>
    </div>
  );

  // Diavetítés megjelenítéséért felelős rész
  const renderSlideShowSection = () => (
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
  );

  // A már értékeléseiket leadott felhasználók id-jei
  const arrayFromStr = eval(film_adatok.rated_user_ids) as number[];

  // Döntés a megjelenítendő részlet alapján
  return film_adatok.rated_user_ids === null
    ? renderFilmDetailsWithRating()
    : arrayFromStr.includes(UserID)
      ? renderFilmDetailsWithoutRating()
      : renderFilmDetailsWithRating();
};

export default RateFilmReszletek;
