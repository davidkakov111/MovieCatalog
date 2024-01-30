"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = parseInt(e.target.value, 10);

    // Ellenőrzés a tartományon belül
    if (!isNaN(inputValue) && inputValue >= 1 && inputValue <= 100) {
    setErtekelesInput(inputValue);
    }
  };

  const handleClick = async () => {
    if (ertekelesInput === '') {
        alert("Az értékelés nem lehet üres!")
    } else {
        if (film_adatok.rated_user_ids === null) {
            // Még nem kapott ez a film értékelést
            const Array = [UserID];
            const rated_user_ids = `[${Array.map(item => String(item)).join(', ')}]`;
            const update_rateing = {
              film_id: film_adatok.id,
              film_ertekeles: ertekelesInput,
              film_rated_user_ids: rated_user_ids,
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
        } else {
            // Ennek a filmnek már vannak értékelései, ezért az
            // átlag értékelésébe beleszámítom az új értékelést
            const UjErtekeles: any = ertekelesInput
            // A string array-t visszaállítom 
            const rated_user_ids = eval(film_adatok.rated_user_ids) as number[];
            // Ennyi alkalommal kapott értékelést a film
            const NrOfRatings = rated_user_ids.length;
            // A film új átlag értékelése
            const film_ertekeles = ((film_adatok.ertekeles * NrOfRatings) + UjErtekeles) / (NrOfRatings + 1)
            // Az értékelő felhasználó id-ját is belteszem a többi közé, hogy kétszer ne tudjon egy filmet értékelni
            rated_user_ids.push(UserID);
            // Viszaállítom az arrayt stringé hogy elmenthessem az adatbázisba
            const RatedUserIds = `[${rated_user_ids.map(item => String(item)).join(', ')}]`;
            // Összeállított adat az API számára
            const update_rateing = {
                film_id: film_adatok.id,
                film_ertekeles: film_ertekeles,
                film_rated_user_ids: RatedUserIds,
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
  if (film_adatok.rated_user_ids === null) {
    // Film részletek megjelenítése értékelés opcióval
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4 bg-gray-300 rounded-md">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">{film_adatok.cim}</h2>
      <img className="w-full h-auto" src={film_adatok.poszter_url} alt={film_adatok.cim} />
      <p className="text-gray-700 mt-4 mb-4">Megjelenés dátuma: {formattedDate}</p>
      <p className="text-gray-700">
        A film átlag értékelése: {Math.round(film_adatok.ertekeles)}/100
      </p>
      {/* Input mező hozzáadása */}
      <input
          type="number"
          min="1"
          max="100"
          placeholder="Értékelés"
          value={ertekelesInput}
          onChange={handleChange}
          className="mr-2 px-4 py-2 border border-gray-300 rounded"
      />
      {/* Gomb hozzáadása */}
      <button
          className="bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={handleClick}
      >
          Beküld
      </button>
      
      <p className="text-gray-700 mt-5">{film_adatok.leiras}</p>
      </div>
    );
  }
  const arrayFromStr = eval(film_adatok.rated_user_ids) as number[];
  if (arrayFromStr.includes(UserID)) {
    // Film részletek megjelenítése értékelés opció nélkül
    return (
        <div className="max-w-2xl mx-auto mt-8 p-4 bg-gray-300 rounded-md">
        <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">{film_adatok.cim}</h2>
        <img className="w-full h-auto" src={film_adatok.poszter_url} alt={film_adatok.cim} />
        <p className="text-gray-700 mt-4 mb-4">Megjelenés dátuma: {formattedDate}</p>
        <p className="text-gray-700">
            A film átlag értékelése: {Math.round(film_adatok.ertekeles)}/100 (Te már egyszer értékelted)
        </p>
        <p className="text-gray-700 mt-5">{film_adatok.leiras}</p>
        </div>
    );
  } else {
    // Film részletek megjelenítése értékelés opcióval
    return (
        <div className="max-w-2xl mx-auto mt-8 p-4 bg-gray-300 rounded-md">
        <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">{film_adatok.cim}</h2>
        <img className="w-full h-auto" src={film_adatok.poszter_url} alt={film_adatok.cim} />
        <p className="text-gray-700 mt-4 mb-4">Megjelenés dátuma: {formattedDate}</p>
        <p className="text-gray-700">
          A film átlag értékelése: {Math.round(film_adatok.ertekeles)}/100
        </p>
        {/* Input mező hozzáadása */}
        <input
            type="number"
            min="1"
            max="100"
            placeholder="Értékelés"
            value={ertekelesInput}
            onChange={handleChange}
            className="mr-2 px-4 py-2 border border-gray-300 rounded"
        />
        {/* Gomb hozzáadása */}
        <button
            className="bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={handleClick}
        >
            Beküld
        </button>
        
        <p className="text-gray-700 mt-5">{film_adatok.leiras}</p>
        </div>
    );
  }
};

export default RateFilmReszletek;
