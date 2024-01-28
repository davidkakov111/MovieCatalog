// Az importált csomagok
import { NextApiRequest, NextApiResponse } from 'next';
import { getfilmbycim } from '../../src/app/database/dbmethods';
import { RowDataPacket } from 'mysql2'; 

// API kezelő függvény
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    // Ellenőrizem, hogy a kérés típusa GET-e
    if (req.method !== 'GET') {
      // Ha nem, akkor visszaküldök egy hibát
      return res.status(405).json({ message: 'Method Not Allowed! (Use GET!)' });
    }
    
    // Meghívom a getfilmbycim függvényt, hogy lekérjem a film adatokat
    const result = await getfilmbycim();
    if (result !== null) {
        // Ha vannak eredmények, kicsomagolom és visszaküldöm JSON formátumban
        const extracted = result[0] as RowDataPacket[];
        return res.status(200).json({ result: extracted });
    } else {
        // Ha hiba történik, 500-as státusszal visszaküldöm egy hibaüzenettel
        return res.status(500).json({ result: "Internal server error!" });
    }
}
