import { pool } from "../../database/index.js";
import type { IMovie, IUpdateMovie } from "./interface/index.js";
import { canReachDFS, getRewatchOrder, type Edge } from "../../utils/graph.js";

// update patch
export const updateMovieService = async (movieId: string, payload: Partial<IUpdateMovie>) => {
  const { watched, preRequisiteIds, movieBody } = payload;

  const movie = await pool.query(`
    SELECT * FROM movies 
    WHERE id=$1
    `,
    [movieId]
  );

  if(movie.rowCount === 0) throw new Error("movie not found");

  const preReqIds = preRequisiteIds ? [...new Set(preRequisiteIds)] : undefined;

  if(preReqIds) {
    for(const id of preReqIds) {
      const movieExist = await pool.query(`
        SELECT * FROM movies
        WHERE id=$1
      `,
        [id]
      );

      if(movieExist.rowCount === 0) throw new Error("movie not found");
    }

    const edges = await pool.query(`
      SELECT movie_id, prerequisite_movie_id 
      FROM movie_prerequisites;  
    `);

    const preReqMap = new Map<string, string[]>();
    for(const edge of edges.rows) {
      if(edge.movie_id === movieId) continue;
      if(!preReqMap.has(edge.movie_id)) preReqMap.set(edge.movie_id, []);
      preReqMap.get(edge.movie_id)!.push(edge.prerequisite_movie_id);
    }

    for(const id of preReqIds) {
      if (id === movieId || canReachDFS(preReqMap, id, movieId)) {
        throw new Error("circular dependency error");
      }
    }
  }

  if(preReqIds) {
    const oldRows = await pool.query(`
      SELECT prerequisite_movie_id 
      FROM movie_prerequisites 
      WHERE movie_id = $1
      `,
      [movieId]
    );

    const oldIds: string[] = oldRows.rows.map((r) => r.prerequisite_movie_id);

    const toRemove = oldIds.filter((id) => !preReqIds.includes(id));
    const toAdd = preReqIds.filter((id) => !oldIds.includes(id));
  
    for (const prereqId of toRemove) {
      await pool.query(`
        DELETE FROM movie_prerequisites 
        WHERE movie_id = $1 AND prerequisite_movie_id = $2`,
        [movieId, prereqId]
      );
    }

    for (const prereqId of toAdd) {
      await pool.query(`
        INSERT INTO movie_prerequisites (movie_id, prerequisite_movie_id) 
        VALUES ($1, $2)`,
        [movieId, prereqId]
      );
    }
  }

  if (watched !== undefined) {
    await pool.query(`UPDATE movies SET watched = $2 WHERE id = $1`, [movieId, watched]);
  }

  if(movieBody !== undefined) {
    await pool.query(
      `UPDATE movies SET
        imdb_id = COALESCE($2, imdb_id),
        title = COALESCE($3, title),
        year = COALESCE($4, year),
        rated = COALESCE($5, rated),
        released = COALESCE($6, released),
        runtime = COALESCE($7, runtime),
        genre = COALESCE($8, genre),
        plot = COALESCE($9, plot),
        poster = COALESCE($10, poster),
        imdb_rating = COALESCE($11, imdb_rating),
        type = COALESCE($12, type),
        watched = COALESCE($13, watched),
        updated_at = NOW()
      WHERE id = $1;
      `,
      [
        movieId,
        movieBody.imdbId ?? null,
        movieBody.title ?? null,
        movieBody.year ?? null,
        movieBody.rated ?? null,
        movieBody.released ?? null,
        movieBody.runtime ?? null,
        movieBody.genre ?? null,
        movieBody.plot ?? null,
        movieBody.poster ?? null,
        movieBody.imdbRating ?? null,
        movieBody.movieType ?? null,
        watched ?? null,
      ]
    );
  }

  await pool.query(`UPDATE movies SET updated_at = NOW() WHERE id = $1`, [movieId]);
  return getMovieByIdService(movieId);
}

// Get Rewatch Order of a Movie
export const getRewatchOrderService = async (id: string) => {
  const movie = await pool.query(`
    SELECT * FROM movies WHERE id=$1
    `,
    [id]
  );

  if(movie.rowCount === 0) throw new Error("movie not found");

  const getEdges = await pool.query(`
    SELECT movie_id, prerequisite_movie_id FROM movie_prerequisites;
  `);

  const orderedIds = getRewatchOrder(getEdges.rows as Edge[], id);

  if (orderedIds.length === 0) {
    return { order: [], total: 0, watchedCount: 0 };
  }

  const moviesResult = await pool.query(
    `SELECT id, title, year, runtime, watched
     FROM movies
     WHERE id = ANY($1::uuid[])`,
    [orderedIds]
  );

  const byId = new Map(moviesResult.rows.map((m) => [m.id, m]));
  const order = orderedIds.map((id) => byId.get(id)!);

  const watchedCount = order.filter((m) => m.watched).length;

  return {
    order,
    total: order.length,
    watchedCount,
  };
}

// Get All Movies
export const getAllMovieService = async () => {
  const result = await pool.query(`
    SELECT * FROM movies;
    `)

  return result;
}

// Get a Movie by ID
export const getMovieByIdService = async (id: string) => {
  const movieResult = await pool.query(`
    SELECT * FROM movies 
    WHERE id=$1
    `,
    [id]
  );

  if(movieResult.rowCount === 0) throw new Error("movie not found");

  const ratingsResult = await pool.query(`
    SELECT id, source, value
    FROM movie_ratings
    WHERE movie_id = $1
    ORDER BY source;
  `,
    [id]
  );

  const preReqResult = await pool.query(`
    SELECT
      m.id,
      m.imdb_id,
      m.title,
      m.year,
      m.poster
    FROM movie_prerequisites mp
    INNER JOIN movies m
      ON m.id = mp.prerequisite_movie_id
    WHERE mp.movie_id = $1
    ORDER BY m.title;
  `,
    [id]
  );

  return {
    ...movieResult.rows[0],
    ratings: ratingsResult.rows,
    preRequisites: preReqResult.rows
  };
}

// Create a movie
export const createMovieService = async (payload: IMovie) => {
  const {
    imdbId, title, genre, poster, imdbRating, 
    rated, plot, released, movieType, runtime, year
   } = payload;

   const result = await pool.query(`
    INSERT INTO movies (
      imdb_id, title, year, rated, released,
      runtime, genre, plot, poster, imdb_rating, type
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *;
  `,
  [
    imdbId, title, year, rated, released, runtime,
    genre, plot, poster, imdbRating, movieType,
  ]);

  return result;
} 