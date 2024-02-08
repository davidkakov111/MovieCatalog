// Imported packages
import { NextApiRequest, NextApiResponse } from 'next';
import { getAllUsers } from '../../src/app/database/dbmethods';

// Api handler 
export default async function getAllUsersAPI(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Check if the request method is GET
        if (req.method !== 'GET') {
            // If not, return a method not allowed error
            return res.status(405).json({ message: 'Method Not Allowed!' });
        }
        
        // Call the getAllUsers function to retrieve user data
        const result = await getAllUsers();
 
        // If "Server error" return it
        if (result === "Server error") {
            return res.status(500).json({ result: result });
        }

        // Remove passwords from the result as it's risky to expose them to the frontend
        // even though they are hashed 
        const usersWithoutPasswords = result.map((user: { password: string, [key: string]: any }) => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        // Check the result and send the appropriate response
        if (usersWithoutPasswords) {
            // If there is a result, send the user data (without passwords)
            return res.status(200).json({ result: usersWithoutPasswords });
        } else {
            // If there is no result, send an internal server error message
            return res.status(500).json({ result: "Internal server error!" });
        }
    } catch {
        // Error handling: If any error occurs, send an internal server error message
        return res.status(500).json({ result: "Internal server error! (try/catch)" });
    }
}
