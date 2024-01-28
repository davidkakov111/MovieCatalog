import { redirect } from 'next/navigation';
import SignInForm from './SignIn';
import { getServerSession } from 'next-auth';

export default async function  SignInPage ()  {
  const session = await getServerSession();
  if (session) {
    redirect("/")
  }
  return (
    <div className="h-screen flex items-center justify-center bg-gray-720 py-16">
      <SignInForm />
    </div>
  );
};
