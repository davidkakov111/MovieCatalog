"use client"
import React, { useState } from 'react';
import { movie_data } from '../database/dbmethods';

// Component for creating new movies
const MovieForm: React.FC = () => {

  // Initializing states
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [posterUrl, setPosterUrl] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [imageUrl1, setImageUrl1] = useState('');
  const [imageUrl2, setImageUrl2] = useState('');
  const [imageUrl3, setImageUrl3] = useState('');
  const [imageUrl4, setImageUrl4] = useState('');
  const [imageUrl5, setImageUrl5] = useState('');

  // Movie categories
  const categorys = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-fi'];

  // Handling form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Empty field not allowed
    if (!title || !description || !posterUrl || !selectedCategory || !imageUrl1 || !imageUrl2 || !imageUrl3 || !imageUrl4 || !imageUrl5) {
      alert('All fields are required!');
      return;
    }

    // Creating current date
    const currentDate = new Date();
    // Formatting date to YYYY-MM-DD format
    const relaseDate = new Date(currentDate.toISOString().split('T')[0]);
    
    try {
      // On successful validation, compile movie data
      const result: movie_data = {
        "title": title,
        "description": description,
        "poster_url": posterUrl,
        "category": selectedCategory,
        "image1": imageUrl1,
        "image2": imageUrl2,
        "image3": imageUrl3,
        "image4": imageUrl4,
        "image5": imageUrl5,
        "relase_date": relaseDate
      };
      
      // Send POST request to the backend
      const response = await fetch('/api/NewMovieRecord', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
      });

      // Response in JSON format
      const responseData = await response.json();

      if (response.ok) {
        // On successful response, display message to the user
        alert(`Movie successfully saved!`);
      } else {
        if (responseData.result === "Existing film") {
          alert('This movie has already been saved, save another one!');
        } else {
          // In case of an error, log the error to console and notify the user
          console.error('Error during data transmission:', responseData.result);
          alert('Error during data transmission');
        }
      }
    } catch (error) {
      // In case of an error, log the error to console and notify the user
      console.error('An error occurred:', error);
      alert('An error occurred');
    }
  };

  // Form component
  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 p-4 bg-gray-100 shadow-md rounded">
      {/* Title input */}
      <label className="block mb-2 text-black">
        Title:
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mt-1 p-2 bg-white border rounded" />
      </label>

      {/* Category selector */}
      <label className="block mb-2 text-black">
        Category:
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full mt-1 p-2 bg-white border rounded"
        >
          <option value="" disabled>Select a category</option>
          {categorys.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      {/* Poster URL input */}
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
      {/* Description textarea */}
      <label className="block mb-2 text-black">
        Description:
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1 p-2 bg-white border rounded"></textarea>
      </label>

      {/* Submit button */}
      <button type="submit" className="w-full mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Submit
      </button>
    </form>
  );
};

export default MovieForm;