// Az importált komponensek
import FilmReszletek from './fetchDetails';
import { getServerSession } from 'next-auth';
import EditorFilmReszletek from './Editor';

// Az AdminPage függvény, ami aszinkron módon fut
export default async function AdminPage () {
    // Session lekérése a szerverről
    const session = await getServerSession();

    // Ellenőrizem, hogy vane session
    if (!session) {
        // Ha nincs session, akkor a FilmReszletek komponens megjelenítése
        return (
            <div>
                <FilmReszletek />
            </div>
        );
    } else {
        // Ha van session, ellenőrizem, hogy az felhasználó Editor-e
        if (session.user?.image !== "Editor") {
            // Ha nem, akkor is a FilmReszletek komponens megjelenítése
            return (
                <div>
                    <FilmReszletek />
                </div>
            );
        } else {
            // Ha igen, akkor az EditorFilmReszletek komponens megjelenítése
            return (
                <div>
                    <EditorFilmReszletek />
                </div>
            );
        }
    }
};