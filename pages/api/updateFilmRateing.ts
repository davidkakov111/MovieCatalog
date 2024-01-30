// Az importált csomagok
import { NextApiRequest, NextApiResponse } from 'next';
import { updateFilmRateing } from '../../src/app/database/dbmethods';

// Api handler 
export default async function updateFilmRate(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Ellenőrizem, hogy a kérés típusa POST-e
        if (req.method !== 'POST') {
            // Ha nem, akkor visszaküldök egy hibát
            return res.status(405).json({ message: 'Method Not Allowed!' });
        }
        const NewFilmRateing = req.body;
        // Meghívom az updateFilmRateing fuggvenyt, hogy frissítse a film értékelését
        const result = await updateFilmRateing (NewFilmRateing);
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
