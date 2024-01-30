// Az importált komponensek
import FilmReszletek from './fetchDetails';
import { getServerSession } from 'next-auth';
import EditorFilmReszletek from './Editor';
import RateFilmReszletek from './RateDetails';

// A FilmDetails függvény
export default async function FilmDetails () {
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
        if (session.user?.image === "Editor") {
            // Ha igen, akkor az EditorFilmReszletek komponenst jelenítem meg
            return (
                <div>
                    <EditorFilmReszletek />
                </div>
            );
        } else {
            // Ellenőrizem, hogy az felhasználó Viewer-e
            if (session.user?.image === "Viewer") {
                // A RateFilmReszletek komponenst jelenítem meg, mert Viewer a felhasználó
                return (
                    <div>
                        <RateFilmReszletek UserID={session.user?.name} />
                    </div>
                );
            } else {
                // Admin a felhasználó, tehát a FilmReszletek komponenst jelenítem meg
                return (
                    <div>
                        <FilmReszletek />
                    </div>
                );
            }
        }
    }
};
