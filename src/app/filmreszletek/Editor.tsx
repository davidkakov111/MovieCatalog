"use client"
import React, { useEffect, useState } from 'react';

// Film részleteinek lekérdezése aszinkron módon
const fetchFilmDetails = async (cim: string) => {
  try {
    const response = await fetch(`/api/filmDetailsBycim?title=${encodeURIComponent(cim)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Hiba történt a film részleteinek lekérése közben:', error);
    return null;
  }
};

// Film szerkesztő komponens
const EditorFilmReszletek: React.FC = () => {
  // State változók inicializálása a film adataival
  const [cim, setCim] = useState('');
  const [poszterUrl, setPoszterUrl] = useState('');
  const [kepekUrl1, setKepekUrl1] = useState('');
  const [kepekUrl2, setKepekUrl2] = useState('');
  const [kepekUrl3, setKepekUrl3] = useState('');
  const [kepekUrl4, setKepekUrl4] = useState('');
  const [kepekUrl5, setKepekUrl5] = useState('');
  const [leiras, setLeiras] = useState('');
  const [selectedKategoria, setKategoria] = useState('');
  const [filmDetails, setFilmDetails] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Elérhető kategóriák
  const kategoriak = ['Akció', 'Vígjáték', 'Dráma', 'Horror', 'Sci-fi'];

  useEffect(() => {
    // URL paraméterek lekérése
    const urlParams = new URLSearchParams(window.location.search);
    const cim = urlParams.get('title');

    const fetchData = async () => {
      if (!cim) {
        setIsLoading(false);
        return;
      }

      try {
        // Film részleteinek lekérése és állapotfrissítés
        const data = await fetchFilmDetails(cim);
        setFilmDetails(data);
        const DATA = data[0][0];
        setCim(DATA.cim);
        setPoszterUrl(DATA.poszter_url);
        setLeiras(DATA.leiras);
        setKategoria(DATA.kategoria);
        setKepekUrl1(DATA.kepek1);
        setKepekUrl2(DATA.kepek2);
        setKepekUrl3(DATA.kepek3);
        setKepekUrl4(DATA.kepek4);
        setKepekUrl5(DATA.kepek5);
        setIsLoading(false);
      } catch (error) {
        console.error('Hiba történt a film részleteinek lekérése közben:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Űrlap beküldésekor végrehajtandó műveletek
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Ellenőrzések
      if (!cim || !leiras || !poszterUrl || !selectedKategoria || !kepekUrl1 || !kepekUrl2 || !kepekUrl3 || !kepekUrl4 || !kepekUrl5) {
        alert('Minden mező kitöltése kötelező!');
        return;
      }
      // Új adatok objektumának létrehozása
      const newData = {
        id: film_adatok?.id,
        cim: cim,
        leiras: leiras,
        poszter_url: poszterUrl,
        kategoria: selectedKategoria,
        kepek1: kepekUrl1,
        kepek2: kepekUrl2,
        kepek3: kepekUrl3,
        kepek4: kepekUrl4,
        kepek5: kepekUrl5,
      };

      // Backend felé történő adatküldés POST kérés segítségével
      const response = await fetch('/api/updateFilmRecord', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });

      // Ha sikerült frissíteni a filmet
      if (response.ok) {
        alert('A film sikeresen frissítve!');
      } else {
        console.error('Hiba a módosítások mentése során:', response.statusText);
        alert('Hiba a módosítások mentése során');
      }
    } catch (error) {
      console.error('Hiba történt:', error);
      alert('Hiba történt');
    }
  };

  // Betöltési állapot kezelése
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-center">Betöltés...</h1>
      </div>
    );
  }

  // Ha nincsenek film részletek
  if (!filmDetails) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-center">Nincsenek adatok a filmről!</h1>
      </div>
    );
  }

  // Film részletek objektumának kinyerése
  const film_adatok = filmDetails[0][0];
  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-gray-300 rounded-md">
      <form onSubmit={handleSubmit}>
        <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Film szerkesztése</h2>
        <label className="block mb-2 text-black">
          Cím:
          <input
            type="text"
            value={cim}
            onChange={(e) => setCim(e.target.value)}
            className="w-full mt-1 p-2 bg-white border rounded"
          />
        </label>
        <label className="block mb-2 text-black">
          Kategória:
          <select
            value={selectedKategoria}
            onChange={(e) => setKategoria(e.target.value)}
            className="w-full mt-1 p-2 bg-white border rounded"
          >
            {kategoriak.map((kategoria, index) => (
              <option key={index} value={kategoria}>
                {kategoria}
              </option>
            ))}
          </select>
        </label>
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
        <label className="block mb-2 text-black">
          Leírás:
          <textarea
            value={leiras}
            onChange={(e) => setLeiras(e.target.value)}
            className="w-full mt-1 p-2 bg-white border rounded"
          ></textarea>
        </label>
        <button type="submit" className="w-full mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Módosítások mentése
        </button>
      </form>
    </div>
  );
};

export default EditorFilmReszletek;
