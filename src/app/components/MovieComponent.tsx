import React from 'react';
import Link from 'next/link';
import ReactStarRatings from 'react-star-ratings';

const MovieComponent: React.FC<{ title: string; imageUrl: string, rating: number }> = ({
  title,
  imageUrl,
  rating
}) => {
  return (
    <div className="text-center">
      <Link href={`/MovieDetails?title=${encodeURIComponent(title)}`}>
        {/* Button that elevates on hover and the text becomes lighter gray */}
        <button className="flex flex-col items-center gap-2 mb-5 mt-5 transition-transform hover:transform hover:-translate-y-1 hover:text-gray-300 focus:outline-none">
          <span className="text-xl font-semibold">{title}</span>
          <img src={imageUrl} alt={title} className="w-64 h-64 object-cover rounded-lg" />
          <ReactStarRatings
            rating={rating}
            starRatedColor="#B8860B"
            starEmptyColor="black"
            starDimension="20px"
            starSpacing="2px"
          />
        </button>
      </Link>
    </div>
  );
};

export default MovieComponent;