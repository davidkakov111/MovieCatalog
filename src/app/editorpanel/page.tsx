import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import MovieForm from './MovieForm';

// This function defines the page for creating a new movie
export default async function MovieDetails() {
  // Retrieve server-side session
  const session = await getServerSession();

  // If there is no session, redirect the user to the home page
  if (!session) {
    redirect("/");
  } else {
    // If the user is not an "Editor", redirect to the home page
    if (session.user?.image !== "Editor") {
      redirect("/");
    } else {
      // If all checks pass successfully, display the MovieForm component
      return (
        <MovieForm />
      );
    }
  }
}
