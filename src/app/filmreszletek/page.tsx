"use client"
import React from 'react';
import { useSearchParams } from 'next/navigation';

export default async function FilmReszletek () {
  // URL paraméterek lekérése
  const params = useSearchParams();
  // Ha nincs paraméter, megjelenítem a megfelelő üzenetet
  if (!params) {
    return <h1>Nem érkezett paraméter!</h1>;
  }
  // A film címének kinyerése a paraméterekből
  const cim = params?.get('title');
  // Ellenőrizem, hogy van-e cím, mielőtt lekérdezném a részleteket
  if (cim === null){
    return <h1>Nem érkezett meg a cim! Nem tudom mely film adatait kell megjelenitsem!</h1>;
  }
  // Fetch kérés a szerverhez a film részletekért
  const response = await fetch(`/api/filmDetailsBycim?title=${encodeURIComponent(cim)}`);
  // JSON válasz feldolgozása
  const data = await response.json();
  if (data === null) {
    return <h1>Nincsenek adatok a filmről!</h1>;
  }
  // Ha vannak film részletek, formázom a dátumot, és megjelenítem azokat
  const film_adatok = data[0][0];
    const formattedDate = new Date(film_adatok.megjelenes_datuma).toLocaleDateString();
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4 bg-gray-100 rounded-md">
        <h2 className="text-3xl font-bold mb-4 text-center text-black">{film_adatok.cim}</h2>
        <img className="w-full h-auto" src={film_adatok.poszter_url} alt={film_adatok.cim} />
        <p className="text-gray-700 mb-4">Megjelenés dátuma: {formattedDate}</p>
        <p className="text-gray-700 mb-4">Értékelés: {film_adatok.ertekeles}</p>
        <p className="text-gray-700 mb-4">{film_adatok.leiras}</p>
      </div>
    );
}