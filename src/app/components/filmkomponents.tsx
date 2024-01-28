import React from 'react';
import Link from 'next/link';

// FilmKomponens: Egy egyszerű filmkomponens, amely megjeleníti a film címét egy Link segítségével.
const FilmKomponens: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="text-center">
      <Link href={`/filmreszletek?title=${encodeURIComponent(title)}`}>
      {/* Gomb, amely emelkedik hover hatásra, és a szöveg világosabb szürkévé válik */}
      <button className="text-lg font-semibold mb-3 mt-3 transition-transform hover:transform hover:-translate-y-1 hover:text-gray-300 focus:outline-none">
        {title}
      </button>
      </Link>
    </div>
  );
};

export default FilmKomponens;
