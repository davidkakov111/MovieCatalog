import { redirect } from 'next/navigation';
import SignInForm from './SignIn';
import { getServerSession } from 'next-auth';

// Az oldal alapértelmezett exportja, ami bejelentkezési oldalt reprezentál
export default async function SignInPage() {
  // Session lekérése
  const session = await getServerSession();

  // Ha a felhasználó már be van jelentkezve, átirányítjom a főoldalra
  if (session) {
    redirect("/");
  }

  // Bejelentkezési oldal megjelenítése
  return (
    <div className="h-screen flex items-center justify-center bg-gray-720 py-16">
      <SignInForm />
    </div>
  );
};
