import React from 'react';
import Link from 'next/link';

// A simple movie component that displays the title of the movie using a Link.
const MovieComponent: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="text-center">
      <Link href={`/MovieDetails?title=${encodeURIComponent(title)}`}>
      {/* Button that elevates on hover and the text becomes lighter gray */}
      <button className="text-lg font-semibold mb-3 mt-3 transition-transform hover:transform hover:-translate-y-1 hover:text-gray-300 focus:outline-none">
        {title}
      </button>
      </Link>
    </div>
  );
};

export default MovieComponent;
