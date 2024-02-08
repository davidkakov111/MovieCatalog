// Perform imports with the necessary modules
import SignUpForm from './SignUpForm';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

// SignUpPage is an asynchronous function that performs login checks and displays the SignUpForm
export default async function SignUpPage() {
  // Fetch session
  const session = await getServerSession();

  // Check if the user is already logged in and redirect to the homepage if so
  if (session) {
    redirect("/");
  }

  // If the user is not logged in, display the SignUpForm
  return (
    <div className="h-screen flex items-center justify-center bg-gray-720 py-16">
      <SignUpForm />
    </div>
  );
};