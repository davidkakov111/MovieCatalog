"use client"
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts';
import { RowDataPacket } from 'mysql2';
import randomColor from 'randomcolor';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';

// Analytics panel kompónens
const AnalyticsPanelForm: React.FC = () => {
  // State-ek inicializálása
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [FilmData, setFilmekCimekEsErtekelesek] = useState<RowDataPacket[] | null>(null);
  const [CategoryData, setCategoryData] = useState<RowDataPacket[] | null>(null);

  // Window resize esemény kezelése
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Clean-up: Eseménykezelő eltávolítása, amikor a komponens unmountolódik
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Film és kategória adatok lekérése API-ból
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getAllFilm', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const jsres = await response.json();
          const extracted = jsres.result as RowDataPacket[];

          // Film adatok feldolgozása és állapot frissítése
          const filmekCimekEsErtekelesek = extracted.map(({ cim, reviews }) => ({ cim, reviews })) as RowDataPacket[];
          setFilmekCimekEsErtekelesek(filmekCimekEsErtekelesek)

          // Kategória adatok feldolgozása és állapot frissítése
          const category_data = extractCategoryData(extracted);
          setCategoryData(category_data);
        } else {
          console.error('Hiba a filmek lekérése során:', response.statusText);
        }
      } catch (error) {
        console.error('Hiba történt:', error);
      }
    };

    // Komponens mount-ja során adatok lekérése
    fetchData();
  }, [windowWidth]);  // Frissítés csak akkor, ha a windowWidth megváltozik

  // Ez a függvény filmadatokból kinyeri az egyes filmkategóriákhoz tartozó értékeket
  // és egy új tömbben tárolva visszaadja azokat.
  const extractCategoryData = (filmData: RowDataPacket[]): RowDataPacket[] => {
    // Film kategóriák definiálása
    const categories = ['Akció', 'Vígjáték', 'Dráma', 'Horror', 'Sci-fi'];

    // Kategóriákon végigiterálva előállítja az új tömböt
    const category_data = categories.map((category) => {
      // A kategóriához tartozó filmek számának összegzése
      const reviews = filmData
        .filter((film) => film.kategoria === category)
        .reduce((total, film) => total + film.reviews, 0);

      // Visszaadja az objektumot, mely tartalmazza a kategóriát és az összesített értékeket
      return { Kategória: category, reviews };
    }) as RowDataPacket[];

    // Az elkészült tömb visszaadása
    return category_data;
  };

  // Betöltés lejátszása  
  if (!FilmData || !CategoryData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-center">Betöltés...</h1>
      </div>
    );
  }

  // Az összes adat PDF fájlba való exportálása
  const generatePdf = async () => {
    // Ha megvan az összes adat
    if (FilmData && CategoryData) {
      const chartContainer = document.getElementById('ChartContainer');
      // Ha a chartcontainer meg van jelenítve
      if (chartContainer !== null) {
        // Elkészítem a képet a diagramokról, hogy az összes adatot PDF-be tudjam exportálni
        const pngUrl = await htmlToImage.toPng(chartContainer);
        // A base64 formátumu png url első részét kitörlöm
        const base64Image = pngUrl.replace(/^data:image\/png;base64,/, '');
        // Létrehozok egy új jsPDF objektumot
        const pdf = new jsPDF();
        // Hozzáadom a képet a PDF-hez
        pdf.addImage(await Buffer.from(base64Image, 'base64'), 'JPEG', 0, 10, 200, 280);
        // Mentem a PDF-et a felhasználónak "analytics.pdf" néven
        pdf.save('analytics.pdf');
      }
    }
  };

  // Szélességek definiálása a diagramokhoz
  const barcontainerWidth =  window.innerWidth < 900 ? window.innerWidth : window.innerWidth / 1.5;
  const circlecontainerWidth = barcontainerWidth / 2.5

  // Random szín generálása a kör diagramokhoz  
  const generateRandomColor = () => randomColor();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
      <div className="text-3xl font-bold">Statisztikák</div>
      <br />
      <div id="ChartContainer">
        {/* Oszlop diagram a filmeknek */}
        <div>
          <h2 style={{ textAlign: 'center' }}>Filmek népszerűsége megjelenésük óta</h2>
          <BarChart width={barcontainerWidth} height={barcontainerWidth / 2.5} data={FilmData}>
            <XAxis dataKey="cim" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="reviews" fill="#8884d8" />
          </BarChart>
        </div>
        <br />
        <br />
        {/* Oszlop diagram a kategóriáknak */}
        <div>
          <h2 style={{ textAlign: 'center' }}>Kategóriák népszerűsége megjelenésük óta</h2>
          <BarChart width={barcontainerWidth} height={barcontainerWidth / 2.5} data={CategoryData}>
            <XAxis dataKey="Kategória" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="reviews" fill="#82ca9d" />
          </BarChart>
        </div>
        {/* Kör diagramok kategóriáknak és a filmeknek*/}
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
          <div>
            <br />
            <h2 style={{ textAlign: 'center' }}>Kategóriák népszerűsége</h2>
            <PieChart width={circlecontainerWidth} height={circlecontainerWidth}>
              <Pie
                data={CategoryData}
                dataKey="reviews"
                nameKey="Kategória"
                cx="50%"
                cy="50%"
                outerRadius={circlecontainerWidth / 2.5}
                label
              >
                {FilmData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={generateRandomColor()} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
            <br />
          </div>
          <div>
            <br /> 
            <h2 style={{ textAlign: 'center' }}>Filmek népszerűsége</h2>
            <PieChart width={circlecontainerWidth} height={circlecontainerWidth}>
              <Pie
                data={FilmData}
                dataKey="reviews"
                nameKey="cim"
                cx="50%"
                cy="50%"
                outerRadius={circlecontainerWidth / 2.5}
                label
              >
                {FilmData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={generateRandomColor()} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
            <br />
          </div>
        </div>
      </div>
      <br />
      {/* Ezzel a gombal tudja a felhasználó letölteni a PDF-et */}
      <button
        onClick={generatePdf}
        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-3xl transition duration-300 ease-in-out transform hover:scale-105"
      >
        Export to PDF
      </button>
      <br />
      <br />
    </div>
  );
}

export default AnalyticsPanelForm;
