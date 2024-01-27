"use client"
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const FilmReszletek: React.FC = () => {
  // URL paraméterek lekérése
  const params = useSearchParams();

  // Ha nincs paraméter, megjelenítem a megfelelő üzenetet
  if (!params) {
    return <h1>Nem érkezett paraméter!</h1>;
  }

  // A film címének kinyerése a paraméterekből
  const cim = params?.get('title');

  // Állapotok a film részletek és a betöltési állapot tárolására
  const [filmDetails, setFilmDetails] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect: A komponens életciklusának része, aszinkron műveletek végrehajtására használom
  useEffect(() => {
    // A film részletek lekérdezése a szerverről
    const fetchFilmDetails = async () => {
      try {
        // Ellenőrizem, hogy van-e cím, mielőtt lekérdezném a részleteket
        if (cim) {
          // Fetch kérés a szerverhez a film részletekért
          const response = await fetch(`/api/filmDetailsBycim?title=${encodeURIComponent(cim)}`);
          // JSON válasz feldolgozása
          const data = await response.json();
          // Állapot frissítése a lekért film részletekkel
          setFilmDetails(data as any);
        }
      } catch (error) {
        // Hibakezelés: logolom a hibát, ha valami nem sikerült
        console.error('Hiba történt a film részleteinek lekérése közben:', error);
        return <h1>Nincsenek adatok a filmről!</h1>;
      } finally {
        // Betöltési állapot beállítása 'false'-ra, akkor is, ha hiba történt
        setIsLoading(false);
      }
    };

    // Fetch hívás indítása a komponens első renderelésekor, vagy ha a cím megváltozik
    fetchFilmDetails();
  }, [cim]);

  // Ha nincs cím vagy éppen betöltődnek az adatok
  if (!cim || isLoading) {
    return <h1>{isLoading ? 'Betöltés...' : 'Ismeretlen film!'}</h1>;
  }

  // Ha vannak film részletek, formázom a dátumot, és megjelenítjük az adatokat
  if (filmDetails !== null) {
    const film_adatok = filmDetails[0][0];
    const formattedDate = new Date(film_adatok.megjelenes_datuma).toLocaleDateString();
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4 bg-gray-100 rounded-md">
        <h2 className="text-3xl font-bold mb-4">{film_adatok.cim}</h2>
        <img className="w-full h-auto" src={film_adatok.poszter_url} alt={film_adatok.cim} />
        <p className="text-gray-700 mb-4">Megjelenés dátuma: {formattedDate}</p>
        <p className="text-gray-700 mb-4">Értékelés: {film_adatok.ertekeles}</p>
        <p className="text-gray-700 mb-4">{film_adatok.leiras}</p>
      </div>
    );
  } else {
    return <h1>Nincsenek adatok a filmről!</h1>;
  }
};

export default FilmReszletek;
