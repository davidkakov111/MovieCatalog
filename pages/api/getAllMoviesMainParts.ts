// Imported packages
import { NextApiRequest, NextApiResponse } from 'next';
import { getAllMoviesMainParts } from '../../src/app/database/dbmethods';

// Api handler 
export default async function getAllMovieMainPartAPI(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Check if the request method is GET
        if (req.method !== 'GET') {
            // If not, return an error
            return res.status(405).json({ message: 'Method Not Allowed!' });
        }
        // Call the getAllMoviesMainParts function to retrieve movie data
        const result = await getAllMoviesMainParts();
        if (typeof result === "string") {
            return res.status(500).json({ result: result });
        } else {
            return res.status(200).json({ result: result });
        }
    } catch (error) {
        await console.log(error)
        // Error handling: If any error occurs, return an internal server error message
        return res.status(500).json({ result: "Internal server error! (try/catch)" });
    }
}
