// Importálom az AdminPanel komponenst és a szükséges next/navigation, next-auth modulokat
import AdminPanel from './AdminPanel';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

// Az AdminPage függvénnyel a bejelentkezett felhasználók ellenőrzését végezem
export default async function AdminPage() {
    // Session lekérés
    const session = await getServerSession();

    // Ellenőrizem, hogy a felhasználó be van-e jelentkezve
    if (!session) {
        // Ha nincs bejelentkezett felhasználó, a kezdőoldalra irányítom
        redirect("/");
    } else {
        // Ha a felhasználó be van jelentkezve, de nem admin, átirányítom a kezdőoldalra
        if (session.user?.image !== "Admin") {
            redirect("/");
        }
    }

    // Ha az ellenőrzések sikeresek, megjelenítem az AdminPanel komponenst
    return (
        <div>
            <AdminPanel />
        </div>
    );
};
