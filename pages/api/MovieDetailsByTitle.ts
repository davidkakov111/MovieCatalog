// Imported packages
import { NextApiRequest, NextApiResponse } from 'next';
import { getMovieDetailsByTitle } from '../../src/app/database/dbmethods';

// MovieDetails function for the API endpoint
export default async function MovieDetails(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Extract the "title" parameter from the URL
    const { title } = req.query;
    // Check if the "title" parameter is a string value
    if (typeof title === 'string') {
      // If valid, query the movie details from the database
      const Details = await getMovieDetailsByTitle(title);
      if (typeof Details === "string") {
        return res.status(500).json({ result: Details });
      } else {
        // Send back the movie details as the response to the client
        return res.status(200).json({result: Details});
      }
    } else {
      // If the "title" parameter is not a single string value, send back an error
      return res.status(400).json({ error: 'Invalid request' });
    }
  } catch {
    // Error handling: If any error occurs, send an internal server error message
    return res.status(500).json({ result: "Internal server error! (try/catch)" });
  }
}
