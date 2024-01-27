import React from 'react';
import Link from 'next/link';

// FilmKomponens: Egy egyszerű filmkomponens, amely megjeleníti a film címét egy Link segítségével.
const FilmKomponens: React.FC<{ title: string }> = ({ title }) => {
  return (
    <Link href={`/filmreszletek?title=${encodeURIComponent(title)}`}>
      {/* A filmcím Link-ként megjelenítése egy számozott listaelembe ágyazva.*/}
      <li><h2>{title}</h2></li>
    </Link>
  );
};

export default FilmKomponens;
