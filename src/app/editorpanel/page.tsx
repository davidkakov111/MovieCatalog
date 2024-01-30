import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import FilmForm from './FilmForm';

// Ez a függvény az oldal komponensét definiálja
export default async function FilmDetails() {
  // Szerveroldali session lekérése
  const session = await getServerSession();

  // Ellenőrzés: Ha nincs session, átirányítás a kezdőlapra
  if (!session) {
    redirect("/");
  } else {
    // Ellenőrzés: Ha a felhasználó nem "Editor", átirányítás a kezdőlapra
    if (session.user?.image !== "Editor") {
      redirect("/");
    }
  }

  // Ha minden ellenőrzés sikeres, megjelenítem a FilmForm komponenst
  return (
    <FilmForm />
  );
}