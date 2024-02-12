import { Pool } from 'pg';

// Types
export type updated_movie = {
  id: number,
  title: string,
  description: string,
  poster_url: string,
  category: string,
  image1: string,
  image2: string,
  image3: string,
  image4: string,
  image5: string,
}
export type update_movie_review = {
  id: number
  reviews: number,
  review_dates: string
}
export type new_movie_rating = {
  id: number,
  movie_rating: number,
  rated_user_ids: string,
  rate_dates: string
}
export type new_movie_comments = {
  id: number,
  comments: string
}
export type movie_data = {
  title: string,
  description: string,
  poster_url: string,
  category: string,
  image1: string,
  image2: string,
  image3: string,
  image4: string,
  image5: string,
  relase_date: Date,
}
export type update_user_type = {
  email: string,
  newType: string
}

// Configuration for the PostgreSQL database
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
  ssl: true
});

// Update the user type in the "users" table based on email
export async function updateUserTypeByEmail(user: update_user_type): Promise<string> {
  const client = await pool.connect();
  try {
    // Update the user type
    await client.query('UPDATE users SET type = $1 WHERE email = $2', [user.newType, user.email]);
    return 'Update successful';
  } catch (error) {
    console.error('Error during update:', error);
    // Return a text in case of server error
    return 'Server error';
  } finally {
    client.release();
  }
}

// Update movie by ID
export async function updateMovieByID(Updated_movie: updated_movie): Promise<string> {
  const client = await pool.connect();
  try {
    // Update the movie
    await client.query('UPDATE movies SET title = $1, description = $2, poster_url = $3, category = $4, image1 = $5, image2 = $6, image3 = $7, image4 = $8, image5 = $9 WHERE id = $10',
      [Updated_movie.title, Updated_movie.description, Updated_movie.poster_url, Updated_movie.category, Updated_movie.image1, Updated_movie.image2, Updated_movie.image3, Updated_movie.image4, Updated_movie.image5, Updated_movie.id]);
    return 'Update successful';
  } catch (error) {
    console.error('Error during update:', error);
    // Return a text in case of server error
    return 'Server error';
  } finally {
    client.release();
  }
}

// Update movie review by ID
export async function updateMovieReviewByID(Update_movie_review: update_movie_review): Promise<string> {
  const client = await pool.connect();
  try {
    // Update the movie review
    await client.query('UPDATE movies SET reviews = $1, review_dates = $2 WHERE id = $3',
      [Update_movie_review.reviews, Update_movie_review.review_dates, Update_movie_review.id]);
    return 'Update successful';
  } catch (error) {
    console.error('Error during update:', error);
    // Return a text in case of server error
    return 'Server error';
  } finally {
    client.release();
  }
}

// Update movie rating
export async function updateMovieRating(NewMovieRating: new_movie_rating): Promise<string> {
  const client = await pool.connect();
  try {
    // Update the rating
    await client.query('UPDATE movies SET rating = $1, rated_user_ids = $2, rate_dates = $3 WHERE id = $4',
      [NewMovieRating.movie_rating, NewMovieRating.rated_user_ids, NewMovieRating.rate_dates, NewMovieRating.id]);
    return 'Update successful';
  } catch (error) {
    console.error('Error during update:', error);
    // Return a text in case of server error
    return 'Server error';
  } finally {
    client.release();
  }
}

// Update movie comments
export async function updateMovieComments(NewMovieComment: new_movie_comments): Promise<string> {
  const client = await pool.connect();
  try {
    // Update the comments
    await client.query('UPDATE movies SET comments = $1 WHERE id = $2',
      [NewMovieComment.comments, NewMovieComment.id]);
    return 'Update successful';
  } catch (error) {
    console.error('Error during update:', error);
    // Return a text in case of server error
    return 'Server error';
  } finally {
    client.release();
  }
}

// Retrieve movie details by title from the "movies" table
export async function getMovieDetailsByTitle(title: string) {
  const client = await pool.connect();
  try {
    // Retrieve the movie (Titles are unique)
    const { rows } = await client.query('SELECT * FROM movies WHERE title = $1', [title]);
    if (rows.length === 0) {
      return "Movie details are not available";
    }
    return rows;
  } catch (error) {
    console.error('Error during query:', error);
    // Return a text in case of server error
    return 'Server error';
  } finally {
    client.release();
  }
}

// Retrieve user details by email from the "users" table
export async function getUserDetailsByEmail(email: string) {
  const client = await pool.connect();
  try {
    // Retrieve the user (Emails are unique)
    const { rows } = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length === 0) {
      return 'SignUp';
    }
    return rows;
  } catch (error) {
    console.error('Error during query:', error);
    // Return a text in case of server error
    return 'Server error';
  } finally {
    client.release();
  }
}

// Retrieve all users
export async function getAllUsers() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT * FROM users');
    return rows;
  } catch (error) {
    console.error('Error during query:', error);
    // Return a text in case of server error
    return 'Server error';
  } finally {
    client.release();
  }
}

// Retrieve all movies
export async function getAllMovies() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT * FROM movies');
    return rows;
  } catch (error) {
    console.error('Error during query:', error)
    // Return a text in case of server error
    return "Server error";
  } finally {
    client.release();
  }
}

// Create movie record
export async function createMovieRecord(movieData: movie_data): Promise<string> {
  const client = await pool.connect();
  try {
    // Create and execute SQL insert command with values
    const sql = 'INSERT INTO movies (title, description, release_date, poster_url, category, image1, image2, image3, image4, image5) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
    const values = [movieData.title, movieData.description, movieData.relase_date, movieData.poster_url, movieData.category, movieData.image1, movieData.image2, movieData.image3, movieData.image4, movieData.image5];
    await client.query(sql, values);
    return 'Record successfully created!';
  } catch (error: any) {
    if (error.code === "23505") {
      return 'Existing film';
    } else {
      console.error('Error during record creation:', error);
      // Return a text in case of server error
      return 'Server error';
    }
  } finally {
    client.release();
  }
}

// Register user
export async function createUserRecord(email: string, password: string): Promise<string> {
  const client = await pool.connect();
  try {
    // Create and execute SQL insert command with values
    const sql = 'INSERT INTO users (email, password, type) VALUES ($1, $2, $3)';
    const values = [email, password, 'Viewer'];
    await client.query(sql, values);
    return 'Success';
  } catch (error: any) {
    // Check if the email already exists 
    if (error.code === "23505") {
      return 'SignIn';
    } else {
      console.error('Error during record creation:', error);
      // Return a text in case of server error
      return 'Server error';
    }
  } finally {
    client.release();
  }
}

// Create a database table for movies
export async function createMoviesTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS movies (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        release_date DATE NOT NULL,
        poster_url TEXT NOT NULL,
        rating FLOAT DEFAULT 0,
        rated_user_ids TEXT,
        category VARCHAR(255) NOT NULL,
        reviews INT DEFAULT 0,
        rate_dates TEXT,
        review_dates TEXT,
        image1 TEXT,
        image2 TEXT,
        image3 TEXT,
        image4 TEXT,
        image5 TEXT,
        comments TEXT
      );
    `);
    return 'success';
  } catch (error) {
    console.error('Error during table creation:', error);
    return 'Server error';
  } finally {
    client.release();
  }
}

// Create a database table for users
export async function createUsersTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        type VARCHAR(255) NOT NULL
      )
    `);
    return 'success';
  } catch (error) {
    console.error('Error during table creation:', error);
    return 'Server error';
  } finally {
    client.release();
  }
}
