// Imported components
import MovieDetails from './fetchDetails';
import EditMovie from './Editor';
import RateMovie from './RateDetails';
import { getServerSession } from 'next-auth';

// The movie_details function
export default async function movie_details () {
    // Fetch session from the server
    const session = await getServerSession();
    // Check if there is a session
    if (!session) {
        // If there is no session, display the MovieDetails component
        return (
            <div>
                <MovieDetails />
            </div>
        );
    } else {
        // If there is a session, check if the user is an Editor
        if (session.user?.image === "Editor") {
            // If yes, display the EditMovie component
            return (
                <div>
                    <EditMovie />
                </div>
            );
        } else {
            // Check if the user is a Viewer
            if (session.user?.image === "Viewer") {
                // Display the RateMovie component because the user is a Viewer
                return (
                    <div>
                        <RateMovie UserID={session.user?.name} />
                    </div>
                );
            } else {
                // The user is an Admin, so display the MovieDetails component
                return (
                    <div>
                        <MovieDetails />
                    </div>
                );
            }
        }
    }
};
