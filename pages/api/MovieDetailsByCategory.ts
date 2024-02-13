// Imported packages
import { NextApiRequest, NextApiResponse } from 'next';
import { getMovieDetailsByCategory } from '../../src/app/database/dbmethods';

// API handler
export default async function MoviesByCategory (req: NextApiRequest, res: NextApiResponse) {
    try {
        // Check if the request method is POST
        if (req.method !== 'POST') {
            // If not, return an error
            return res.status(405).json({ message: 'Method Not Allowed!' });
        }
        
        // Extract the category from the request body
        const category: string = req.body;
        // Call the getMovieDetailsByCategory function with the category
        const result = await getMovieDetailsByCategory(category);
        
        // Check the result and return the appropriate response
        if (typeof result !== 'string')  {
            return res.status(200).json({ result: result });
        } else {
            return res.status(500).json({ result: result });
        }
    } catch {
        // Error handling: If any error occurs, send an internal server error message
        return res.status(500).json({ result: "Internal server error! (try/catch)" });
    }
}
