import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import FilmForm from './FilmForm';

export default async function  FilmDetails ()  {
  const session = await getServerSession();
  if (!session) {
    redirect("/")
  }
  return (
    <FilmForm/>
  );
};
