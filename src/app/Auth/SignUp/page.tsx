// Az importokat elvégezem a szükséges modulok beolvasásával
import SignUpForm from './SignUpForm';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

// A SignUpPage egy aszinkron függvény, amely bejelentkezési ellenőrzéseket hajt végre és megjeleníti a SignUpForm-ot
export default async function SignUpPage() {
  // Session lekérése
  const session = await getServerSession();

  // Ellenőrizem, hogy a felhasználó már bejelentkezett-e, és ha igen, átirányítom a főoldalra
  if (session) {
    redirect("/");
  }

  // Ha a felhasználó nincs bejelentkezve, akkor megjelenítem a SignUpForm-ot
  return (
    <div className="h-screen flex items-center justify-center bg-gray-720 py-16">
      <SignUpForm />
    </div>
  );
};
