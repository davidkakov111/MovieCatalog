import { redirect } from 'next/navigation';
import SignInForm from './SignIn';
import { getServerSession } from 'next-auth';

// Default export of the page, representing the sign-in page
export default async function SignInPage() {
  // Retrieving session
  const session = await getServerSession();

  // If the user is already signed in, redirect to the main page
  if (session) {
    redirect("/");
  }

  // Displaying the sign-in page
  return (
    <div className="h-screen flex items-center justify-center bg-gray-720 py-16">
      <SignInForm />
    </div>
  );
};
