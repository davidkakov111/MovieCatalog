// Imported packages
import { NextApiRequest, NextApiResponse } from 'next';
import { createMovieRecord, movie_data } from '../../src/app/database/dbmethods';

// NewMovie function for the API endpoint
export default async function NewMovie(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Check if the request method is POST
        if (req.method !== 'POST') {
            // If not, return an error
            return res.status(405).json({ message: 'Method Not Allowed!' });
        }
        
        // Extract the new movie data from the request body
        const new_movie: movie_data = req.body;
        
        // Call the createFilmRecord function with the new movie
        const result = await createMovieRecord(new_movie);
        
        // Check the result and return the appropriate response
        if (result) {
            if (result === 'Record successfully created!') {
                return res.status(200).json({ result: result });
            } else {
                return res.status(500).json({ result: result });
            }
        } else {
            return res.status(500).json({ result: "Internal server error!" });
        }
    } catch {
        // Error handling: If any error occurs, send an internal server error message
        return res.status(500).json({ result: "Internal server error! (try/catch)" });
    }
}
