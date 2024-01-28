import { hash } from 'bcrypt';
import { createUserRecord } from '../../../database/dbmethods';

export async function POST(request: Request) {
  try {
    // Felhasználói adatok kinyerése a kérés törzséből
    const { email, password } = await request.json();
    
    // Jelszó hashelése
    const hashedPassword = await hash(password, 10);
    
    // Felhasználói adatok összeállítása
    const UserData = { "email": email, "password": hashedPassword };
    
    // Felhasználói rekord létrehozása az adatbázisban
    const result = await createUserRecord(UserData);
    
    // Sikeres regisztráció esetén
    if (result === 'Success') {
        return new Response(JSON.stringify({ success: true, message: result }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
    } else {
        // Hiba esetén
        return new Response(JSON.stringify({ success: false, message: result }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
  } catch (e) {
    // Szerverhiba esetén
    return new Response(JSON.stringify({ success: false, message: 'Szerverhiba' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}