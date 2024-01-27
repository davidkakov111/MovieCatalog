// Az importált csomagok
import { NextApiRequest, NextApiResponse } from 'next';
import { getFilmDetailsBycim } from '../../src/app/database/dbmuveletek';

// Az API végpont kezelőfüggvénye
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Az URL-ből kinyert "title" paraméter
  const { title } = req.query;
  // Ellenőrizem, hogy a "title" paraméter egyetlen szöveges érték-e
  if (typeof title === 'string') {
    // Ha megfelelő, lekérdezem a film részleteit az adatbázisból
    const filmDetails = await getFilmDetailsBycim(title);
    // Válaszként vissza küldöm a film részleteit a kliensnek
    res.status(200).json(filmDetails);
  } else {
    // Ha a "title" paraméter nem egyetlen szöveges érték, akkor hibát küldök vissza
    res.status(400).json({ error: 'Invalid request' });
  }
}
