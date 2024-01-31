"use client"
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts';
import { RowDataPacket } from 'mysql2';
import randomColor from 'randomcolor';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';

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

  // Kategória adatok feldolgozása
  const extractCategoryData = (filmData: RowDataPacket[]): RowDataPacket[] => {
    const categories = ['Akció', 'Vígjáték', 'Dráma', 'Horror', 'Sci-fi'];
    const category_data = categories.map((category) => {
      const reviews = filmData
        .filter((film) => film.kategoria === category)
        .reduce((total, film) => total + film.reviews, 0);
      return { Kategória: category, reviews };
    }) as RowDataPacket[];
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
    if (FilmData && CategoryData) {
      const chartContainer = document.getElementById('ChartContainer');
      if (chartContainer !== null) {
        // Elkészítem a képet a diagramokról
        const pngUrl = await htmlToImage.toPng(chartContainer);
        const base64Image = pngUrl.replace(/^data:image\/png;base64,/, '');
        // Létrehozok egy új jsPDF objektumot
        const pdf = new jsPDF();
        // Hozzáadom a képet a PDF-hez
        pdf.addImage(await Buffer.from(base64Image, 'base64'), 'JPEG', 0, 10, 200, 280);
        // Mentem a PDF-et a felhasználónak
        pdf.save('pdf_with_image.pdf');
      }
    }
  };

  // Dinamikus szélességek a diagramokhoz
  const outerRadius = window.innerWidth / 10
  const circlecontainerWidth = window.innerWidth < 600 ? window.innerWidth / 1.4 : window.innerWidth / 2.8;
  const barcontainerWidth =  window.innerWidth < 900 ? window.innerWidth : window.innerWidth / 1.5;

  // Random szín generálása a kör diagramokhoz  
  const generateRandomColor = () => randomColor();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
      <div className="text-3xl font-bold">Statisztikák</div>
      <br />
      <div id="ChartContainer">
        {/* Oszlop diagram a filmek népszerűségéhez */}
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
        {/* Oszlop diagram a kategóriák népszerűségéhez */}
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
        {/* Kör diagramok kategóriák és filmek népszerűségéhez */}
        <div style={{ display: 'flex', flexDirection: window.innerWidth < 600 ? 'column' : 'row' }}>
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
                outerRadius={outerRadius}
                label
              >
                {FilmData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={generateRandomColor()} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
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
                outerRadius={outerRadius}
                label
              >
                {FilmData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={generateRandomColor()} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
            <br />
          </div>
        </div>
      </div>
      <br />
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
