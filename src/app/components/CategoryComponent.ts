
const fetchMoviesByCategory = async (category: string) => {
    try {
      // Send a POST request to the backend API for movies by category (~ lazy loading)
      const response = await fetch('/api/MovieDetailsByCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });

      // Parsing the JSON response
      const jsres = await response.json();
    
      // Check if the request was successful
      if (response.ok) {
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

export { fetchMoviesByCategory };
