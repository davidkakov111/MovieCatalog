import mysql from 'mysql2/promise';

// MySQL adatbazis konfigurációja (Hosztolt adatbázis, hogy a 
// weboldal hostolva is megfelelően működhessen)
const pool = mysql.createPool({
  host: 'sql11.freemysqlhosting.net',
  user: 'sql11679887',
  password: 'bhSQkesCHI',
  database: 'sql11679887',
  port: 3306,
});

// Egy film rekord lekérdezése ID alapján a "filmek" táblából
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

// Filmek címének lekérdezése a "filmek" tábla "cim" oszlopából
export async function getfilmbycim() {
  const connection = await pool.getConnection();
  try {
    const rows = await connection.query('SELECT cim FROM filmek');
    if ([rows].length === 0) {
      return null;
    }
    return rows;
  } catch (error) {
    console.error('Hiba a lekerdezes kozben:', error);
    return null;
  } finally {
    connection.release();
  }
}

// Film rekord létrehozása a "filmek" táblában
export async function createFilmRecord(movieData: any): Promise<void> {
    const connection = await pool.getConnection();
    try {
        // SQL insert parancs létrehozása és végrehajtása az értékekkel
        const sql = 'INSERT INTO filmek (cim, leiras, megjelenes_datuma, poszter_url, ertekeles) VALUES (?, ?, ?, ?, ?)';
        const values = [movieData.cim, movieData.leiras, movieData.megjelenesDatuma, movieData.poszter_url, movieData.ertekeles];
        await connection.execute(sql, values);
        console.log('Rekord sikeresen letrehozva!');
    } catch (error) {
        console.error('Hiba a rekord letrehozasa kozben:', error, "Hiba vege!");
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
          cim VARCHAR(255) NOT NULL,
          leiras TEXT NOT NULL,
          megjelenes_datuma DATE NOT NULL,
          poszter_url VARCHAR(255) NOT NULL,
          ertekeles INT NOT NULL
        )
      `);
    } finally {
      connection.release();
    }
  }
  