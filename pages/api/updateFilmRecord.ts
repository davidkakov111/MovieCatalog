// Az importált csomagok
import { NextApiRequest, NextApiResponse } from 'next';
import { updateFilmByID } from '../../src/app/database/dbmethods';

// Api handler 
export default async function updateFilmRecordByID(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Ellenőrizem, hogy a kérés típusa POST-e
        if (req.method !== 'POST') {
            // Ha nem, akkor visszaküldök egy hibát
            return res.status(405).json({ message: 'Method Not Allowed!' });
        }
        const film_details = req.body;
        // Meghívom az updateFilmByID-t, hogy frissítsem a filmet
        const result: any = await updateFilmByID(film_details);
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
