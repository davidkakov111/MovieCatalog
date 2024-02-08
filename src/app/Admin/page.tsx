// Importing the AdminPanel component and necessary next/navigation, next-auth modules
import AdminPanel from './AdminPanel';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

// Using the AdminPage function to verify logged-in users
export default async function AdminPage() {
    // Session request
    const session = await getServerSession();

    // Checking if the user is logged in
    if (!session) {
        // If there is no logged-in user, redirect to the homepage
        redirect("/");
    } else {
        // If the user is logged in but not an admin, redirect to the homepage
        if (session.user?.image !== "Admin") {
            redirect("/");
        } else {
            // If the user is an admin, display the AdminPanel component
            return (
                <div>
                    <AdminPanel />
                </div>
            );
        }
    }
};
