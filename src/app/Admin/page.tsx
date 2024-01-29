import AdminPanel from './AdminPanel';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

export default async function AdminPage () {
    const session = await getServerSession();
    if (!session) {
        redirect("/")
    } else {
        if (session.user?.image !== "Admin") {
        redirect("/")
        }
    }
    return (
    <div>
        <AdminPanel />
    </div>
    );
};
