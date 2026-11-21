import { pool } from "../database/index.js"; 
import { movies } from "./data/movie.js";
import { moviePrerequisites } from "./data/preRequisite.js";
import { initDb } from "../database/index.js";
import { cinemas } from "./data/cinema.js";


async function seed() {
  await initDb();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const movie of movies) {
      const movieRes = await client.query(
        `
        INSERT INTO movies (
          imdb_id, title, year, rated, released, runtime,
          genre, plot, poster, imdb_rating, type, watched
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (imdb_id) DO NOTHING
        RETURNING id
        `,
        [
          movie.imdb_id,
          movie.title,
          movie.year,
          movie.rated,
          movie.released,
          movie.runtime,
          movie.genre,
          movie.plot,
          movie.poster,
          movie.imdb_rating,
          movie.type,
          movie.watched,
        ]
      );

      // Optional: also insert some ratings
      if (movieRes.rows[0]) {
        const movieId = movieRes.rows[0].id;

        await client.query(
          `
          INSERT INTO movie_ratings (movie_id, source, value)
          VALUES
            ($1, 'Internet Movie Database', $2),
            ($1, 'Rotten Tomatoes', '91%')
          ON CONFLICT (movie_id, source) DO NOTHING
          `,
          [movieId, String(movie.imdb_rating)]
        );
      }
    }

    // seeding pre req
    for (const entry of moviePrerequisites) {
      if (entry.prerequisite_imdb_ids.length === 0) continue;

      await client.query(
        `
        INSERT INTO movie_prerequisites (movie_id, prerequisite_movie_id)
        SELECT m.id, p.id
        FROM movies m
        JOIN movies p ON p.imdb_id = ANY($2::text[])
        WHERE m.imdb_id = $1
        ON CONFLICT (movie_id, prerequisite_movie_id) DO NOTHING
        `,
        [entry.movie_imdb_id, entry.prerequisite_imdb_ids]
      );
    }

    // seeding cinemas and bundles
    for (const cinema of cinemas) {
      const cinemaRes = await client.query(
        `
        INSERT INTO cinemas (name)
        VALUES ($1)
        ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
        RETURNING id
        `,
        [cinema.name]
      );

      const cinemaId = cinemaRes.rows[0].id;

      for (const size of cinema.bundles) {
        await client.query(
          `
          INSERT INTO cinema_bundles (cinema_id, size)
          VALUES ($1, $2)
          ON CONFLICT (cinema_id, size) DO NOTHING
          `,
          [cinemaId, size]
        );
      }
    }

    await client.query("COMMIT");
    console.log("Seed completed successfully for Movies, Cinema, Cinema Bundles and Pre Requisites");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Seed failed:", err);
    throw err;
  } finally {
    client.release();
    await pool.end(); 
  }
}


seed().catch(() => process.exit(1));