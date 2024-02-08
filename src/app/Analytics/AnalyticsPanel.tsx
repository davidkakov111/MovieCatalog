// Importing necessary modules
"use client"
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts';
import randomColor from 'randomcolor';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';

// Types
type category_reviews =  {
  Category: string;
  reviews: number;
}[]
type movie_data = {
  title: string;
  reviews: number;
}[]

// Analytics panel component
const AnalyticsPanelForm: React.FC = () => {
  // Initializing states
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [MovieData, setMovieData] = useState<movie_data | null>(null);
  const [CategoryData, setCategoryData] = useState<category_reviews | null>(null);

  // Handling window resize event
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Clean-up: Removing event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Fetching movie and category data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getAllMovie', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const jsres = await response.json();
          const extracted: any[] = jsres.result;

          // Processing film data and updating state
          const movieData: movie_data = extracted.map(({ title, reviews }) => ({ title, reviews }));
          setMovieData(movieData);

          // Processing category data and updating state
          const categoryData = extractCategoryData(extracted);
          setCategoryData(categoryData);
        } else {
          console.error('Error fetching films:', response.statusText);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    // Fetching data when the component mounts
    fetchData();
  }, [windowWidth]);  // Update only when windowWidth changes

  // This function extracts values for each movie category from film data
  // and returns them stored in a new array.
  const extractCategoryData = (filmData: any[]): category_reviews => {
    // Defining movie categories
    const categories = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-fi'];

    // Iterating through categories to generate a new array
    const categoryData = categories.map((category) => {
      // Summing up the number of films for each category
      const reviews: number = filmData
        .filter((film) => film.category === category)
        .reduce((total, film) => total + film.reviews, 0);

      // Returning an object containing the category and aggregated values
      return { Category: category, reviews };
    });

    // Returning the generated array
    return categoryData;
  };

  // Displaying loading while fetching data
  if (!MovieData || !CategoryData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-center">Loading...</h1>
      </div>
    );
  }

  // Exporting all data to a PDF file
  const generatePdf = async () => {
    // If all data is available
    if (MovieData && CategoryData) {
      const chartContainer = document.getElementById('ChartContainer');
      // If chartContainer is rendered
      if (chartContainer) {
        // Generating images of charts to export all data to PDF
        const pngUrl = await htmlToImage.toPng(chartContainer);
        // Removing the first part of the base64 format png url
        const base64Image = pngUrl.replace(/^data:image\/png;base64,/, '');
        // Creating a new jsPDF object
        const pdf = new jsPDF();
        // Adding the image to the PDF
        pdf.addImage(await Buffer.from(base64Image, 'base64'), 'JPEG', 0, 10, 200, 280);
        // Saving the PDF with the name "analytics.pdf"
        pdf.save('analytics.pdf');
      }
    }
  };

  // Defining widths for charts
  const barcontainerWidth =  window.innerWidth < 900 ? window.innerWidth : window.innerWidth / 1.5;
  const circlecontainerWidth = barcontainerWidth / 2.5

  // Generating random color for pie charts
  const generateRandomColor = () => randomColor();
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
      <div className="text-3xl font-bold">Statistics</div>
      <br />
      <div id="ChartContainer">
        {/* Bar chart for films */}
        <div>
          <h2 style={{ textAlign: 'center' }}>Popularity of Films Since Release</h2>
          <BarChart width={barcontainerWidth} height={barcontainerWidth / 2.5} data={MovieData}>
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="reviews" fill="#8884d8" />
          </BarChart>
        </div>
        <br />
        <br />
        {/* Bar chart for categories */}
        <div>
          <h2 style={{ textAlign: 'center' }}>Popularity of Categories Since Release</h2>
          <BarChart width={barcontainerWidth} height={barcontainerWidth / 2.5} data={CategoryData}>
            <XAxis dataKey="Category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="reviews" fill="#82ca9d" />
          </BarChart>
        </div>
        {/* Pie charts for categories and films */}
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
          <div>
            <br />
            <h2 style={{ textAlign: 'center' }}>Popularity by Categories</h2>
            <PieChart width={circlecontainerWidth} height={circlecontainerWidth}>
              <Pie
                data={CategoryData}
                dataKey="reviews"
                nameKey="Category"
                cx="50%"
                cy="50%"
                outerRadius={circlecontainerWidth / 2.5}
              >
                {CategoryData.map((entry, index) => (
                  <Cell  key={`cell-${index}`} fill={generateRandomColor()} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
            <br />
          </div>
          <div>
            <br /> 
            <h2 style={{ textAlign: 'center' }}>Popularity of Films</h2>
            <PieChart width={circlecontainerWidth} height={circlecontainerWidth}>
              <Pie
                data={MovieData}
                dataKey="reviews"
                nameKey="title"
                cx="50%"
                cy="50%"
                outerRadius={circlecontainerWidth / 2.5}
              >
                {MovieData.map((entry, index) => (
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
      {/* Button to download the PDF */}
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
