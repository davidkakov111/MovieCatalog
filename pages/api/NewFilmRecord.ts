// Az importált csomagok
import { NextApiRequest, NextApiResponse } from 'next';
import { createFilmRecord } from '../../src/app/database/dbmethods';

// Api handler 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    // Ellenőrizem, hogy a kérés típusa POST-e
    if (req.method !== 'POST') {
      // Ha nem, akkor visszaküldök egy hibát
      return res.status(405).json({ message: 'Method Not Allowed! (Use POST!)' });
    }
    
    // A film adatokat a kérés testéből kinyerem
    const film_adatok = req.body;
    
    // Meghívom a createFilmRecord függvényt a kapott adatokkal
    const result = await createFilmRecord(film_adatok);
    
    // Ellenőrizem az eredményt és vissza küldöm a megfelelő választ
    if (result) {
        if (result === 'Rekord sikeresen letrehozva!') {
            return res.status(200).json({ result: result });
        } else {
            return res.status(500).json({ result: result });
        }
    } else {
        return res.status(500).json({ result: "Internal server error!" });
    }
}
