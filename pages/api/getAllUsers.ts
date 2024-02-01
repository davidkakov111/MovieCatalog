// Az importált csomagok
import { NextApiRequest, NextApiResponse } from 'next';
import { getAllUsers } from '../../src/app/database/dbmethods';

// Api handler 
export default async function getAllUsersAPI(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Ellenőrizem, hogy a kérés típusa GET-e
        if (req.method !== 'GET') {
            // Ha nem, akkor visszaküldök egy hibát
            return res.status(405).json({ message: 'Method Not Allowed!' });
        }
        
        // Meghívom a getAllUsers függvényt, ami a felhasználók adatait kéri le
        const result: any = await getAllUsers();
        
        // Törölöm a jelszavakat az eredményből, mert azokat kockázatos lenne kiadni 
        // a frontendnek még így is, hogy hashelve vannak
        const usersWithoutPasswords = result.map((user: { password: any, [key: string]: any }) => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        // Ellenőrizem az eredményt és visszaküldöm a megfelelő választ
        if (usersWithoutPasswords) {
            // Ha van eredmény, visszaküldöm a felhasználók adatait (jelszavak nélkül)
            return res.status(200).json({ result: usersWithoutPasswords });
        } else {
            // Ha nincs eredmény, akkor belső szerverhiba üzenetet küldök vissza
            return res.status(500).json({ result: "Internal server error!" });
        }
    } catch {
        // Hibakezelés: Ha bármilyen hiba történik, akkor belső szerverhiba üzenetet küldök vissza
        return res.status(500).json({ result: "Internal server error! (try/catch)" });
    }
}