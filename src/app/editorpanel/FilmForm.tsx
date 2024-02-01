"use client"
import React, { useState } from 'react';

// Kompónens, új filmek létrehozásához
const FilmForm: React.FC = () => {

  // Állapotok inicializálása
  const [cim, setCim] = useState<string>('');
  const [leiras, setLeiras] = useState<string>('');
  const [poszterUrl, setPoszterUrl] = useState<string>('');
  const [selectedKategoria, setSelectedKategoria] = useState<string>('');
  const [kepekUrl1, setKepekUrl1] = useState('');
  const [kepekUrl2, setKepekUrl2] = useState('');
  const [kepekUrl3, setKepekUrl3] = useState('');
  const [kepekUrl4, setKepekUrl4] = useState('');
  const [kepekUrl5, setKepekUrl5] = useState('');

  // Film kategóriák
  const kategoriak = ['Akció', 'Vígjáték', 'Dráma', 'Horror', 'Sci-fi'];

  // Űrlap beküldés kezelése
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Nem megengedett az üresen hagyott mező
    if (!cim || !leiras || !poszterUrl || !selectedKategoria || !kepekUrl1 || !kepekUrl2 || !kepekUrl3 || !kepekUrl4 || !kepekUrl5) {
      alert('Minden mező kitöltése kötelező!');
      return;
    }

    // Maximum hossz ellenőrzése
    if (cim.length > 255 || poszterUrl.length > 255) {
      alert('A cím és a poszter URL legfeljebb 255 karakter lehet!');
      return;
    }

    // A jelenlegi dátum létrehozása
    const currentDate = new Date();

    // Dátum formázása YYYY-MM-DD formátumra
    const megjelenesDatuma = currentDate.toISOString().split('T')[0];

    try {
      // Sikeres ellenőrzés esetén összeállítom a film adatokat
      const result = {
        "cim": cim,
        "leiras": leiras,
        "megjelenes_datuma": megjelenesDatuma,
        "poszter_url": poszterUrl,
        "kategoria": selectedKategoria,
        "kepek1": kepekUrl1,
        "kepek2": kepekUrl2,
        "kepek3": kepekUrl3,
        "kepek4": kepekUrl4,
        "kepek5": kepekUrl5
      };
      
      // El küldöm a POST kérést a backend-nek
      const response = await fetch('/api/NewFilmRecord', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
      });

      // Válasz json formátumban
      const responseData = await response.json();

      if (response.ok) {
        // Sikeres válasz esetén megjelenítem a felhasználónak az üzenetet
        alert(`A film sikeresen elmentve!`);
      } else {
        if (responseData.result === "Meglevo film") {
          alert('Ez a film már el volt mentve, ments el masikat!');
        } else {
          // Hiba esetén konzolra logolom a hibát és értesítem a felhasználót
          console.error('Hiba az adatküldés során:', response.statusText);
          alert('Hiba az adatküldés során');
        }
      }
    } catch (error) {
      // Hiba esetén konzolra logolom a hibát és értesítem a felhasználót
      console.error('Hiba történt:', error);
      alert('Hiba történt');
    }
  };

  // Űrlap komponens
  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 p-4 bg-gray-100 shadow-md rounded">
      {/* Cím input */}
      <label className="block mb-2 text-black">
        Cím:
        <input type="text" value={cim} onChange={(e) => setCim(e.target.value)} className="w-full mt-1 p-2 bg-white border rounded" />
      </label>

      {/* Kategória választó mező */}
      <label className="block mb-2 text-black">
        Kategória:
        <select
          value={selectedKategoria}
          onChange={(e) => setSelectedKategoria(e.target.value)}
          className="w-full mt-1 p-2 bg-white border rounded"
        >
          <option value="" disabled>Válassz egy kategóriát</option>
          {kategoriak.map((kategoria, index) => (
            <option key={index} value={kategoria}>
              {kategoria}
            </option>
          ))}
        </select>
      </label>

      {/* Poszter URL input */}
      <label className="block mb-2 text-black">
        Poszter URL:
        <input
          type="text"
          value={poszterUrl}
          onChange={(e) => setPoszterUrl(e.target.value)}
          className="w-full mt-1 p-2 bg-white border rounded"
        />
      </label>
      <label className="block mb-2 text-black">
        Kép URLs:
        <input
          type="text"
          value={kepekUrl1}
          onChange={(e) => setKepekUrl1(e.target.value)}
          className="w-full mt-1 p-2 bg-white border rounded"
        />
        <input
          type="text"
          value={kepekUrl2}
          onChange={(e) => setKepekUrl2(e.target.value)}
          className="w-full mt-1 p-2 bg-white border rounded"
        />
        <input
          type="text"
          value={kepekUrl3}
          onChange={(e) => setKepekUrl3(e.target.value)}
          className="w-full mt-1 p-2 bg-white border rounded"
        />
        <input
          type="text"
          value={kepekUrl4}
          onChange={(e) => setKepekUrl4(e.target.value)}
          className="w-full mt-1 p-2 bg-white border rounded"
        />
        <input
          type="text"
          value={kepekUrl5}
          onChange={(e) => setKepekUrl5(e.target.value)}
          className="w-full mt-1 p-2 bg-white border rounded"
        />
      </label>
      {/* Leírás textarea */}
      <label className="block mb-2 text-black">
        Leírás:
        <textarea value={leiras} onChange={(e) => setLeiras(e.target.value)} className="w-full mt-1 p-2 bg-white border rounded"></textarea>
      </label>

      {/* Beküldés gomb */}
      <button type="submit" className="w-full mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Beküldés
      </button>
    </form>
  );
};

export default FilmForm;
