import { Pool } from "pg";
import config from "../config/index.js";

export const pool = new Pool({ connectionString: config.DATABASE_URL });

export const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS movies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        imdb_id VARCHAR(20) UNIQUE,

        -- movie information
        title TEXT NOT NULL UNIQUE,
        year TEXT,
        rated VARCHAR(20),
        released TEXT,
        runtime INTEGER CHECK (runtime BETWEEN 1 AND 300),
        genre TEXT,
        plot TEXT,
        poster TEXT,
        imdb_rating NUMERIC(3, 1),
        type VARCHAR(30),
        watched BOOLEAN NOT NULL DEFAULT false,

        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS movie_ratings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

        movie_id UUID NOT NULL
        REFERENCES movies(id)
        ON DELETE CASCADE,

        source TEXT NOT NULL,
        value TEXT NOT NULL,

        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),

        UNIQUE (movie_id, source)
      );

      CREATE TABLE IF NOT EXISTS movie_prerequisites (
        movie_id UUID NOT NULL
          REFERENCES movies(id)
          ON DELETE CASCADE,

        prerequisite_movie_id UUID NOT NULL
          REFERENCES movies(id)
          ON DELETE CASCADE,

        PRIMARY KEY (movie_id, prerequisite_movie_id),

        CONSTRAINT no_self_dependency
          CHECK (movie_id <> prerequisite_movie_id)
      );

      CREATE TABLE IF NOT EXISTS cinemas (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL UNIQUE,

        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS cinema_bundles (
        cinema_id UUID NOT NULL
          REFERENCES cinemas(id)
          ON DELETE CASCADE,

        size INTEGER NOT NULL
          CHECK (size BETWEEN 1 AND 500),

        PRIMARY KEY (cinema_id, size)
      );
    `);

    console.log("Database connected successfully!");
  } catch (error) {
    console.log(`Failed to connect the database`, error);
    throw error;
  }
}
