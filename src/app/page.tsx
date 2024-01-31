// Kötelező importok
"use client"
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic'; 
import Search from './components/search';
import { RowDataPacket } from 'mysql2';

const Otthon: React.FC = () => {
  // Állapot inicializálása a filmadatok tárolására
  const [filmData, setFilmData] = useState<RowDataPacket[] | null>(null);
  const [HotTopicfilmData, setHotTopicFilmData] = useState<RowDataPacket[] | null>(null);
  const [AkcioFilmData, setAkcioFilmData] = useState<RowDataPacket[] | null>(null);
  const [VigjatekFilmData, setVigjatekFilmData] = useState<RowDataPacket[] | null>(null);
  const [DramaFilmData, setDramaFilmData] = useState<RowDataPacket[] | null>(null);
  const [HorrorFilmData, setHorrorFilmData] = useState<RowDataPacket[] | null>(null);
  const [ScifiFilmData, setScifiFilmData] = useState<RowDataPacket[] | null>(null);
  
  // Dinamikusan betöltött komponens a lazy loading megoldásához
  const FilmKomponens = dynamic(() => import('./components/filmkomponents'), { ssr: false });
 
  // useEffect hook használata a komponens mount-ja során a filmadatok lekérésére
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch kérés küldése az API-hoz
        const response = await fetch('/api/getAllFilm', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        // Ellenőrzés, hogy a kérés sikeres volt-e
        if (response.ok) {
          // JSON válasz beolvasása
          const jsres = await response.json();

          // Beolvasott adatok kinyerése és állapot frissítése
          const extracted = jsres.result as RowDataPacket[];
          setFilmData(extracted);

          // Szűrés típus alapján
          const akcioFilmek = extracted.filter(film => film.kategoria === "Akció");
          setAkcioFilmData(akcioFilmek)
          const vigjatekFilmek = extracted.filter(film => film.kategoria === "Vígjáték");
          setVigjatekFilmData(vigjatekFilmek)
          const dramaFilmek = extracted.filter(film => film.kategoria === "Dráma");
          setDramaFilmData(dramaFilmek)
          const horrorFilmek = extracted.filter(film => film.kategoria === "Horror");
          setHorrorFilmData(horrorFilmek)
          const scifiFilmek = extracted.filter(film => film.kategoria === "Sci-fi");
          setScifiFilmData(scifiFilmek)

          // A jelenlegi idő pecsét
          const timestamp: number = Math.floor(Date.now() / 1000);
          // Az utolsó héten belüli időbélyegek határideje
          const hetHatarido = timestamp - 604800;

          // A Hotfilms tartalmazza a filmek múlt heti megtekintéseinek számat is, amihez 
          // hozzáadom a múlt heti értékeléseinek számát 5-el szorozva, így kb. reális képet 
          // kapva azokról a filmekről amelyek a legjobban felkeltették a felhasznalók figyelmét
          const Hotfilms = extracted.map((film) => {
            const reviewDatesCount = film.review_dates
              ? film.review_dates
                  .replace("[", "")
                  .replace("]", "")
                  .split(", ")
                  .filter((date: any) => parseInt(date, 10) > hetHatarido).length
              : 0;
            const rateDatesCount = film.rate_dates
              ? film.rate_dates
                  .replace("[", "")
                  .replace("]", "")
                  .split(", ")
                  .filter((date: any) => parseInt(date, 10) > hetHatarido).length
              : 0;
            return {
              film,
              HotTopicIndex: reviewDatesCount + (rateDatesCount * 5),
            };
          });
          // Filmek a felkapottsági szám alapján, csökkenő sorrendben
          Hotfilms.sort((a, b) => b.HotTopicIndex - a.HotTopicIndex);
          // A top 5 filmek kiválasztása felkapottsági szám alapján
          const top5Film =Hotfilms.slice(0, 5).map((item) => item.film);
          setHotTopicFilmData(top5Film)
        } else {
          // Hiba esetén konzolra logolás
          console.error('Hiba a filmek lekérése során:', response.statusText);
        }
      } catch (error) {
        // Hiba esetén konzolra logolás
        console.error('Hiba történt:', error);
      }
    };

    // fetchData függvény hívása a komponens mount-ja során
    fetchData();
  }, []);

  // Ha még nincsenek betöltve az adatok, megjelenítek egy betöltési üzenetet
  if (!AkcioFilmData || !VigjatekFilmData || !DramaFilmData || !HorrorFilmData || !ScifiFilmData || !filmData || !HotTopicfilmData) {
    return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-center">Betöltés...</h1>
    </div>
    )
  }

  // Ha vannak adatok, megjelenítem a keresőt és a filmkomponenseket
  return (
    <div>
      <div className="mt-4 flex items-center justify-center gap-2 md:mt-8">
        <Search placeholder="Film kereső" extracted={filmData} />
      </div>
      <br />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-black bg-opacity-15 rounded-lg p-4">
          {/* Cím hozzáadása */}
          <h2 className="text-2xl font-semibold mb-4 text-center">Felkapottak</h2>
          {/* Filmek megjelenítése a FilmKomponens segítségével */}
          {HotTopicfilmData.map((movie, index) => (
            <FilmKomponens key={index} title={movie.cim} />
          ))}
        </div>
        <div className="bg-black bg-opacity-15 rounded-lg p-4">
          {/* Cím hozzáadása */}
          <h2 className="text-2xl font-semibold mb-4 text-center">Akció</h2>
          {/* Filmek megjelenítése a FilmKomponens segítségével */}
          {AkcioFilmData.map((movie, index) => (
            <FilmKomponens key={index} title={movie.cim} />
          ))}
        </div>
        <div className="bg-black bg-opacity-15 rounded-lg p-4">
          {/* Cím hozzáadása */}
          <h2 className="text-2xl font-semibold mb-4 text-center">Vígjáték</h2>
          {/* Filmek megjelenítése a FilmKomponens segítségével */}
          {VigjatekFilmData.map((movie, index) => (
            <FilmKomponens key={index} title={movie.cim} />
          ))}
        </div>
        <div className="bg-black bg-opacity-15 rounded-lg p-4">
          {/* Cím hozzáadása */}
          <h2 className="text-2xl font-semibold mb-4 text-center">Dráma</h2>
          {/* Filmek megjelenítése a FilmKomponens segítségével */}
          {DramaFilmData.map((movie, index) => (
            <FilmKomponens key={index} title={movie.cim} />
          ))}
        </div>
        <div className="bg-black bg-opacity-15 rounded-lg p-4">
          {/* Cím hozzáadása */}
          <h2 className="text-2xl font-semibold mb-4 text-center">Horror</h2>
          {/* Filmek megjelenítése a FilmKomponens segítségével */}
          {HorrorFilmData.map((movie, index) => (
            <FilmKomponens key={index} title={movie.cim} />
          ))}
        </div>
        <div className="bg-black bg-opacity-15 rounded-lg p-4">
          {/* Cím hozzáadása */}
          <h2 className="text-2xl font-semibold mb-4 text-center">Sci-fi</h2>
          {/* Filmek megjelenítése a FilmKomponens segítségével */}
          {ScifiFilmData.map((movie, index) => (
            <FilmKomponens key={index} title={movie.cim} />
          ))}
        </div>
      </div>
    </div>
  );
};

// A komponens exportálása
export default Otthon;
