// Hosztolt MySQL adatbazis beallitasa

import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'sql11.freemysqlhosting.net',
  user: 'sql11679887',
  password: 'bhSQkesCHI',
  database: 'sql11679887',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
