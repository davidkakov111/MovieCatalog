// import React, { lazy, Suspense } from 'react';

// const MovieCard = lazy(() => import('./MovieCard'));

// interface MovieListProps {
//   movies: Movie[];
// }

// const MovieList: React.FC<MovieListProps> = ({ movies }) => {
//   return (
//     <div>
//       {movies.map((movie) => (
//         <Suspense key={movie.id} fallback={<div>Loading...</div>}>
//           <MovieCard movie={movie} />
//         </Suspense>
//       ))}
//     </div>
//   );
// };

// export default MovieList;

import Link from 'next/link';

export default function Otthon() {
    return (
      <div>
        <Link href="/filmreszletek">
            Film Katalógus
        </Link>
      </div>
    );
  }

