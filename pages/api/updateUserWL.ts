// Imported packages
import { NextApiRequest, NextApiResponse } from 'next';
import { updateUserWatchL, update_user_WL } from '../../src/app/database/dbmethods';

// Api handler 
export default async function updateUserWLAPI(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Checking if the request type is POST
        if (req.method !== 'POST') {
            // If not, sending back an error
            return res.status(405).json({ message: 'Method Not Allowed!' });
        }
        const user: update_user_WL = req.body;

        // Invoking updateUserWatchL to update the watch list
        const result = await updateUserWatchL(user);
        
        // Forwarding the response with appropriate status code
        if (result === 'Update successful') {
            return res.status(200).json({ result: result });
        } else {
            return res.status(500).json({ result: result});
        }
    } catch {
        // Error handling: Sending back an internal server error message if any error occurs
        return res.status(500).json({ result: "Internal server error! (try/catch)" });
    }
}
