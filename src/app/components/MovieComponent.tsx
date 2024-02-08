import React from 'react';
import Link from 'next/link';

const MovieComponent: React.FC<{ title: string; imageUrl: string }> = ({
  title,
  imageUrl,
}) => {
  return (
    <div className="text-center">
      <Link href={`/MovieDetails?title=${encodeURIComponent(title)}`}>
        {/* Button that elevates on hover and the text becomes lighter gray */}
        <button className="flex flex-col items-center gap-2 mb-3 mt-3 transition-transform hover:transform hover:-translate-y-1 hover:text-gray-300 focus:outline-none">
          <img src={imageUrl} alt={title} className="w-64 h-64 object-cover rounded-lg" />
          <span className="text-xl font-semibold">{title}</span>
        </button>
      </Link>
    </div>
  );
};

export default MovieComponent;