// Importing the watchlist component and necessary next/navigation, next-auth modules
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Watchlist from './watch_list';

export default async function WatchListPage() {
    // Session request
    const session = await getServerSession();

    if (!session) {
        // If there is no logged-in user, redirect to the homepage
        redirect("/");
    } else {
        // If the user is logged in but not viewer, redirect to the homepage
        if (session.user?.image !== "Viewer") {
            redirect("/");
        } else {
            // If the user is viewer, display the watchlist component
            return (
                <div>
                    <Watchlist UserID={session.user?.name} />
                </div>
            );
        }
    }
};
