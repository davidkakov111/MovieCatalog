import SignUpForm from './SignUpForm';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

export default async function SignUpPage () {
  const session = await getServerSession();
  if (session) {
    redirect("/")
  }
  return (
    <div className="h-screen flex items-center justify-center bg-gray-720 py-16">
      <SignUpForm />
    </div>
  );
};
