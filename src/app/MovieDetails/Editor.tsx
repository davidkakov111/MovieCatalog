"use client"
import React, { useEffect, useState } from 'react';
import { updated_movie } from '../database/dbmethods';

// Fetch movie details asynchronously
const fetchMovieDetails = async (title: string) => {
  try {
    const response = await fetch(`/api/MovieDetailsByTitle?title=${encodeURIComponent(title)}`);
    const data = await response.json();
    const result = data.result;
    return result;
  } catch (error) {
    console.error('Error occurred while fetching the movie details:', error);
    return null;
  }
};

// Movie editor component
const EditMovie: React.FC = () => {
  // Initialize state variables with movie data
  const [title, setTitle] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [imageUrl1, setImageUrl1] = useState('');
  const [imageUrl2, setImageUrl2] = useState('');
  const [imageUrl3, setImageUrl3] = useState('');
  const [imageUrl4, setImageUrl4] = useState('');
  const [imageUrl5, setImageUrl5] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setCategory] = useState('');
  const [movieDetails, setMovieDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Available categories
  const categories = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-fi'];

  useEffect(() => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title');

    const fetchData = async () => {
      if (!title) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch film details and update state
        const data = await fetchMovieDetails(title);
        if ( typeof data === "string" || data === null ) {
          console.error('Error occurred while fetching the movie details:', data);
          setIsLoading(false);
          return
        }
        setMovieDetails(data[0]);
        const DATA = data[0];
        setTitle(DATA.title);
        setPosterUrl(DATA.poster_url);
        setDescription(DATA.description);
        setCategory(DATA.category);
        setImageUrl1(DATA.image1);
        setImageUrl2(DATA.image2);
        setImageUrl3(DATA.image3);
        setImageUrl4(DATA.image4);
        setImageUrl5(DATA.image5);
        setIsLoading(false);
      } catch (error) {
        console.error('Error occurred while fetching the movie details:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Actions to be executed when form is submitted
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Checks
      if (!title || !description || !posterUrl || !selectedCategory || !imageUrl1 || !imageUrl2 || !imageUrl3 || !imageUrl4 || !imageUrl5) {
        alert('All fields are required!');
        return;
      }
      if (!movieDetails) {
        alert('Missing movie id!');
        return
      }

      // Create object of new data
      const newData: updated_movie = {
        id: movieDetails.id as number,
        title: title,
        description: description,
        poster_url: posterUrl,
        category: selectedCategory,
        image1: imageUrl1,
        image2: imageUrl2,
        image3: imageUrl3,
        image4: imageUrl4,
        image5: imageUrl5,
      };

      // Send data to backend via POST request
      const response = await fetch('/api/updateMovieRecord', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });
      // If the movie update was successful
      if (response.ok) {
        alert('Movie successfully updated!');
      } else {
        console.error('Error occurred while saving modifications:', response);
        alert('Error occurred while saving modifications');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred');
    }
  };

  // Handling loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-center">Loading...</h1>
      </div>
    );
  }

  // If film details are not available
  if (!movieDetails || movieDetails === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-center">No data available for the film!</h1>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-gray-300 rounded-md">
      <form onSubmit={handleSubmit}>
        <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Edit Film</h2>
        <label className="block mb-2 text-black">
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-1 p-2 bg-white border rounded"
          />
        </label>
        <label className="block mb-2 text-black">
          Category:
          <select
            value={selectedCategory}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mt-1 p-2 bg-white border rounded"
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="block mb-2 text-black">
          Poster URL:
          <input
            type="text"
            value={posterUrl}
            onChange={(e) => setPosterUrl(e.target.value)}
            className="w-full mt-1 p-2 bg-white border rounded"
          />
        </label>
        <label className="block mb-2 text-black">
          Image URLs:
          <input
            type="text"
            value={imageUrl1}
            onChange={(e) => setImageUrl1(e.target.value)}
            className="w-full mt-1 p-2 bg-white border rounded"
          />
          <input
            type="text"
            value={imageUrl2}
            onChange={(e) => setImageUrl2(e.target.value)}
            className="w-full mt-1 p-2 bg-white border rounded"
          />
          <input
            type="text"
            value={imageUrl3}
            onChange={(e) => setImageUrl3(e.target.value)}
            className="w-full mt-1 p-2 bg-white border rounded"
          />
          <input
            type="text"
            value={imageUrl4}
            onChange={(e) => setImageUrl4(e.target.value)}
            className="w-full mt-1 p-2 bg-white border rounded"
          />
          <input
            type="text"
            value={imageUrl5}
            onChange={(e) => setImageUrl5(e.target.value)}
            className="w-full mt-1 p-2 bg-white border rounded"
          />
        </label>
        <label className="block mb-2 text-black">
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 p-2 bg-white border rounded"
          ></textarea>
        </label>
        <button type="submit" className="w-full mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditMovie;
