
const fetchMoviesByCategory = async (category: string, wantPage: number, until: number) => {
    try {
      // Send a POST request to the backend API for movies by category (~ lazy loading)
      const response = await fetch('/api/MovieDetailsByCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([category, wantPage, until]),
      });

      // Parsing the JSON response
      const jsres = await response.json();
    
      // Check if the request was successful
      if (response.ok) {
        if (jsres.result === "Movie details are not available") {
          return jsres.result;
        }
        const extracted: any[] = jsres.result;
        return extracted;
      } else {
        const extracted: string = jsres.result;
        return extracted;
      }
    } catch (error) {
      return `Error fetching ${category} movies: ${error}`;
    }
};

const fetchHotMovies = async (until: number) => {
  try {
    // Send a POST request to the backend API
    const response = await fetch('/api/TrendingMovieDetails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(until),
    });
    // Checking if the request was successful
    if (response.ok) {
      // Parsing the JSON response
      const jsres = await response.json();
      const extracted = jsres.result as any[];
      return extracted;
    } else {
      const jsres = await response.json();
      const extracted = jsres.result;
      // Logging an error to the console in case of an error
      console.error('Error fetching movies:', extracted);
      return `Error fetching movies: ${extracted}`;
    }
  } catch (error) {
    // Logging an error to the console in case of an error
    console.error('An error occurred:', error);
    return `Error fetching trending movies: ${error}`;
  }
};

export { fetchMoviesByCategory, fetchHotMovies };
