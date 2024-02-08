// Imported packages
import { NextApiRequest, NextApiResponse } from 'next';
import { updateMovieByID, updated_movie } from '../../src/app/database/dbmethods';

// Api handler
export default async function updateMovieRecordByID(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Checking if the request method is POST
        if (req.method !== 'POST') {
            // If not, sending back an error
            return res.status(405).json({ message: 'Method Not Allowed!' });
        }
        
        const movie_details: updated_movie = req.body;
        // Calling updateMovieByID to update the movie
        const result = await updateMovieByID(movie_details);

        // Sending back the response with appropriate status code
        if (result === 'Update successful') {
            return res.status(200).json({ result: result });
        } else {
            return res.status(500).json({ result: result});
        }
    } catch {
        // Error handling: Sending back internal server error message if any error occurs
        return res.status(500).json({ result: "Internal server error! (try/catch)" });
    }
}
