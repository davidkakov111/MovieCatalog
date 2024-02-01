import mysql from 'mysql2/promise';

// MySQL adatbazis konfigurációja (Hosztolt adatbázis, hogy a 
// weboldal hostolva is megfelelően működhessen)
const pool = mysql.createPool({
  host: 'sql11.freemysqlhosting.net',
  user: 'sql11679887',
  password: 'bhSQkesCHI',
  database: 'sql11679887',
  port: 3306,
  charset: 'utf8',
});

// Felhasználó típusának frissítése az "users" táblában email alapján
export async function updateUserTypeByEmail(email: string, newType: string): Promise<string> {
  const connection = await pool.getConnection();
  try {
    // Ellenőrizem, hogy a felhasználó létezik-e az adatbázisban
    const userExistsResult = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

    const userExists = [userExistsResult].length > 0;

    if (!userExists) {
      return 'Felhasználó nem található';
    }

    // Frissítem a felhasználó típusát
    await connection.query('UPDATE users SET type = ? WHERE email = ?', [newType, email]);

    return 'Sikeres frissítés';
  } catch (error) {
    console.error('Hiba a frissítés közben:', error);
    // Szerverhiba esetén egy szöveget adok vissza
    return 'Szerverhiba';
  } finally {
    await connection.release();
  }
}

// Film frissítése id alapján
export async function updateFilmByID(Updated_film: any): Promise<string> {
  const connection = await pool.getConnection();
  try {
    // Frissíem a filmet
    await connection.query('UPDATE filmek SET cim = ?, leiras = ?, poszter_url = ?, kategoria = ?, kepek1 = ?, kepek2 = ?, kepek3 = ?, kepek4 = ?, kepek5 = ? WHERE id = ?', 
      [Updated_film.cim, Updated_film.leiras, Updated_film.poszter_url, Updated_film.kategoria, Updated_film.kepek1, Updated_film.kepek2, Updated_film.kepek3, Updated_film.kepek4, Updated_film.kepek5, Updated_film.id]);
    return 'Sikeres frissítés';
  } catch (error) {
    console.error('Hiba a frissítés közben:', error);
    // Szerverhiba esetén egy szöveget adok vissza
    return 'Szerverhiba';
  } finally {
    await connection.release();
  }
}

// Film review frissítése id alapján
export async function updateFilmReviewByID(Update_film_review: any): Promise<string> {
  const connection = await pool.getConnection();
  try {
    // Frissíem a film review-jét
    await connection.query('UPDATE filmek SET reviews = ?, review_dates = ? WHERE id = ?', 
      [Update_film_review.reviews, Update_film_review.review_dates, Update_film_review.id]);
    return 'Sikeres frissítés';
  } catch (error) {
    console.error('Hiba a frissítés közben:', error);
    // Szerverhiba esetén egy szöveget adok vissza
    return 'Szerverhiba';
  } finally {
    await connection.release();
  }
}

// Film értékelésének frissítése
export async function updateFilmRateing(NewFilmRateing: any): Promise<string> {
  const connection = await pool.getConnection();
  try {
    // Frissíem az értékelést
    await connection.query('UPDATE filmek SET ertekeles = ?, rated_user_ids = ?, rate_dates = ? WHERE id = ?', 
      [NewFilmRateing.film_ertekeles, NewFilmRateing.film_rated_user_ids, NewFilmRateing.rate_dates, NewFilmRateing.film_id]);
    return 'Sikeres frissítés';
  } catch (error) {
    console.error('Hiba a frissítés közben:', error);
    // Szerverhiba esetén egy szöveget adok vissza
    return 'Szerverhiba';
  } finally {
    await connection.release();
  }
}

// Film adatok lekérdezése cim alapján a "filmek" táblából
export async function getFilmDetailsBycim(cim: string) {
  const connection = await pool.getConnection();
  try {
    // Filmek lekérése
    const rows = await connection.query('SELECT * FROM filmek WHERE cim = ?', [cim]);
    if ([rows].length === 0) {
      return null;
    }
    return rows;
  } catch (error) {
    console.error('Hiba a lekerdezes kozben:', error);
    return null;
  } finally {
    await connection.release();
  }
}

// Felhasználó adatainak lekérdezése email alapján a "users" táblából
export async function getUserDetailsByEmail(email: string): Promise<any> {
  const connection = await pool.getConnection();
  try {
    const result = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    const extracted_result:any = result[0]
    if (extracted_result.length === 0) {
      return 'SignUp';
    }
    return extracted_result;
  } catch (error) {
    console.error('Hiba a lekérdezés közben:', error);
    // Szerverhiba esetén egy szöveget adok vissza
    return 'Szerverhiba';
  } finally {
    await connection.release();
  }
}

// Film rekord lekérdezése ID alapján a "filmek" táblából
export async function getFilmById(id: number) {
  const connection = await pool.getConnection();
  try {
    const rows = await connection.query('SELECT * FROM filmek WHERE id = ?', [id]);
    if ([rows].length === 0) {
      return null;
    }
    return rows;
  } catch (error) {
    console.error('Hiba a lekerdezes kozben:', error);
    return null;
  } finally {
    await connection.release();
  }
}

// Összes felhasználó lekérése
export async function getAllUsers() {
  const connection = await pool.getConnection();
  try {
    const results = await connection.query('SELECT * FROM users');
    return results[0];
  } finally {
    connection.release();
  }
}

// Összes film lekérése
export async function getAllFilm() {
  const connection = await pool.getConnection();
  try {
    const results = await connection.query('SELECT * FROM filmek');
    return results[0];
  } finally {
    connection.release();
  }
}

// Film létrehozása
export async function createFilmRecord(movieData: any): Promise<string> {
  const connection = await pool.getConnection();
  try {
    // SQL insert parancs létrehozása és végrehajtása az értékekkel
    const sql = 'INSERT INTO filmek (cim, leiras, megjelenes_datuma, poszter_url, kategoria, kepek1, kepek2, kepek3, kepek4, kepek5) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [movieData.cim, movieData.leiras, movieData.megjelenes_datuma, movieData.poszter_url, movieData.kategoria, movieData.kepek1, movieData.kepek2, movieData.kepek3, movieData.kepek4, movieData.kepek5];
    await connection.execute(sql, values);
    return 'Rekord sikeresen letrehozva!';
  } catch (error:any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return 'Meglevo film';
    } else {
      console.error('Hiba a rekord letrehozasa kozben:', error, "Hiba vege!");
      throw new Error('Hiba a rekord letrehozasa kozben');
    }
  } finally {
      await connection.release();
  }
}

// User regisztrálása
export async function createUserRecord(UserData: any): Promise<string> {
  const connection = await pool.getConnection();
  try {
    // SQL insert parancs létrehozása és végrehajtása az értékekkel
    const sql = 'INSERT INTO users (email, password, type) VALUES (?, ?, ?)';
    const values = [UserData.email, UserData.password, 'Viewer'];
    await connection.execute(sql, values);
    return 'Success';
  } catch (error:any) {
    // Ellenőrizem, hogy az e-mail cím már létezik-e
    if (error.code === 'ER_DUP_ENTRY') {
      return 'SignIn';
    } else {
      throw new Error('Hiba a rekord letrehozasa kozben');
    }
  } finally {
    await connection.release();
  }
}

// Adatbázis tábla létrehozása a filmekhez
export async function createFilmsTable() {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS filmek (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cim VARCHAR(255) NOT NULL UNIQUE,
        leiras TEXT NOT NULL,
        megjelenes_datuma DATE NOT NULL,
        poszter_url VARCHAR(255) NOT NULL,
        ertekeles FLOAT DEFAULT 0,
        rated_user_ids TEXT,
        kategoria ENUM('Akció', 'Vígjáték', 'Dráma', 'Horror', 'Sci-fi') NOT NULL,
        reviews INT DEFAULT 0,
        kepek1 TEXT,
        rate_dates TEXT,
        review_dates TEXT
        kepek2 TEXT,
        kepek3 TEXT,
        kepek4 TEXT,
        kepek5 TEXT
      );
    `);
    return 'success';
  } finally {
    connection.release();
  }
}

// Adatbázis tábla létrehozása a felhasználóknak
export async function createUsersTable() {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        type ENUM('Viewer', 'Editor', 'Admin') NOT NULL
      )
    `);
    return 'success';
  } finally {
    connection.release();
  }
}
