"use client"
import React, { useState } from 'react';

const FilmForm: React.FC = () => {
  // Állapotok inicializálása
  const [cim, setCim] = useState<string>('');
  const [leiras, setLeiras] = useState<string>('');
  const [poszterUrl, setPoszterUrl] = useState<string>('');
  const [selectedKategoria, setSelectedKategoria] = useState<string>('');

  const kategoriak = ['Akció', 'Vígjáték', 'Dráma', 'Horror', 'Sci-fi'];

  // Űrlap beküldés kezelése
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ellenőrzések
    if (!cim || !leiras || !poszterUrl.toString() || !selectedKategoria) {
      alert('Minden mező kitöltése kötelező, és az értékelés csak 0 és 10 közötti szám lehet!');
      return;
    }

    if (cim.length > 255 || poszterUrl.length > 255) {
      alert('A cím és az URL legfeljebb 255 karakter lehet!');
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
      };

      // El küldöm a POST kérést a backend-nek
      const response = await fetch('/api/NewFilmRecord', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
      });
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
