// Imported packages
import { NextApiRequest, NextApiResponse } from 'next';
import { getTrendingMovieDetails } from '../../src/app/database/dbmethods';

// Api handler 
export default async function TrendingMovies(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Check if the request method is GET
        if (req.method !== 'GET') {
            // If not, return an error
            return res.status(405).json({ message: 'Method Not Allowed!' });
        }

        // Call the getTrendingMovieDetails function to retrieve the trending movies
        const result = await getTrendingMovieDetails();
        if (typeof result === 'string') {
            return res.status(500).json({ result: result });
        } else {
            return res.status(200).json({ result: result });
        }
    } catch (error) {
        console.log("Error: ", error)
        // Error handling: If any error occurs, return an internal server error message
        return res.status(500).json({ result: "Internal server error! (try/catch)" });
    }
}
