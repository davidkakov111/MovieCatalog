// Imported packages
import { NextApiRequest, NextApiResponse } from 'next';
import { updateMovieReviewByID, update_movie_review } from '../../src/app/database/dbmethods';

// Api handler 
export default async function updateMovieReview(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Checking if the request type is POST
        if (req.method !== 'POST') {
            // If not, then sending back an error
            return res.status(405).json({ message: 'Method Not Allowed!' });
        }
        const Update_movie_review: update_movie_review = req.body;
        // Invoking updateMovieReviewByID to update the movie review properties
        const result = await updateMovieReviewByID(Update_movie_review)
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
