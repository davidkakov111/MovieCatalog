// Imported packages
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserWL } from '../../src/app/database/dbmethods';

// Api handler 
export default async function getUserWatchList(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Checking if the request type is POST
        if (req.method !== 'POST') {
            // If not, sending back an error
            return res.status(405).json({ message: 'Method Not Allowed!' });
        }
        const userID: number = req.body;

        const result = await getUserWL(userID);

        // Forwarding the response with appropriate status code
        if (result !== 'Server error') {
            return res.status(200).json({ result: result });
        } else {
            return res.status(500).json({ result: result});
        }
    } catch {
        // Error handling: Sending back an internal server error message if any error occurs
        return res.status(500).json({ result: "Internal server error! (try/catch)" });
    }
}
