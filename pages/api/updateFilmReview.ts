// Az importált csomagok
import { NextApiRequest, NextApiResponse } from 'next';
import { updateFilmReviewByID } from '../../src/app/database/dbmethods';

// Api handler 
export default async function updateFilmReview(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Ellenőrizem, hogy a kérés típusa POST-e
        if (req.method !== 'POST') {
            // Ha nem, akkor visszaküldök egy hibát
            return res.status(405).json({ message: 'Method Not Allowed!' });
        }
        const Update_film_review = req.body;
        // Meghívom az updateFilmReviewByID-t, hogy frissítsem a film review tulajdonságait
        const result: any = await updateFilmReviewByID(Update_film_review)
        // Továbbitom a választ, megfelelő státuszkóddal
        if (result === 'Sikeres frissítés') {
            return res.status(200).json({ result: result });
        } else {
            return res.status(500).json({ result: result});
        }
    } catch {
        // Hibakezelés: Ha bármilyen hiba történik, akkor belső szerverhiba üzenetet küldök vissza
        return res.status(500).json({ result: "Internal server error! (try/catch)" });
    }
}
