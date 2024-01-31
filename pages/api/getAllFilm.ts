// Az importált csomagok
import { NextApiRequest, NextApiResponse } from 'next';
import { getAllFilm } from '../../src/app/database/dbmethods';

// Api handler 
export default async function getAllFilmAPI(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Ellenőrizem, hogy a kérés típusa GET-e
        if (req.method !== 'GET') {
            // Ha nem, akkor visszaküldök egy hibát
            return res.status(405).json({ message: 'Method Not Allowed!' });
        }
        
        // Meghívom a getAllFilm függvényt, ami a film adatokat kéri le
        const result: any = await getAllFilm();
        return res.status(200).json({ result: result });
    } catch {
        // Hibakezelés: Ha bármilyen hiba történik, akkor belső szerverhiba üzenetet küldök vissza
        return res.status(500).json({ result: "Internal server error! (try/catch)" });
    }
}
