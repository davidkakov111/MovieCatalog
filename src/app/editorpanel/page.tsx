import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import FilmForm from './FilmForm';

// Ez a függvény az új film létrehozása oldalt definiálja
export default async function FilmDetails() {
  // Szerveroldali session lekérése
  const session = await getServerSession();

  // Ha nincs session, átirányítom a kezdőlapra a felhasználót
  if (!session) {
    redirect("/");
  } else {
    // Ha a felhasználó nem "Editor", átirányítom a kezdőlapra
    if (session.user?.image !== "Editor") {
      redirect("/");
    } else {
      // Ha minden ellenőrzés sikeres, megjelenítem a FilmForm komponenst
      return (
        <FilmForm />
      );
    }
  }
}
