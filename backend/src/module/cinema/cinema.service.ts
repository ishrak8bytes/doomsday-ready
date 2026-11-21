import { pool } from "../../database/index.js";
import { calculateBundles } from "../../utils/calculateBundles.js";
import type { ICinema } from "./interface/index.js";

export const getAllCinemaService = async () => {
  const result = await pool.query(`
    SELECT * FROM cinemas;  
  `);

  return result;
}

export const getCinemaByIdService = async (id: string) => {
  const result = await pool.query(`
    SELECT * FROM cinemas WHERE id=$1;  
  `,
    [id]
  );

  if(result.rowCount === 0) throw new Error("cinema not found");

  const bundles = await pool.query(`
    SELECT size FROM cinema_bundles WHERE cinema_id=$1 ORDER BY size;  
  `,
    [result.rows[0].id]
  );

  return {
    ...result.rows[0],
    bundles: bundles.rows.map((row) => row.size)
  };
}

export const getCinemaBookingService = async (id: string, groupSize: number) => {
  const cinema = await pool.query(
    `SELECT id, name FROM cinemas WHERE id = $1`,
    [id]
  );
  
  if (cinema.rowCount === 0) throw new Error("cinema not found");

  const sizesResult = await pool.query(
    `SELECT size FROM cinema_bundles WHERE cinema_id = $1 ORDER BY size`,
    [id]
  );

  const bundles: number[] = sizesResult.rows.map((row) => row.size);
  const result = calculateBundles(groupSize, bundles);

  return {
    id,
    cinemaName: cinema.rows[0].name,
    groupSize,
    ...result,
  };
}

export const createCinemaService = async (payload: ICinema) => {
  const { name, bundles } = payload;
  
  const cinema = await pool.query(`
    INSERT INTO cinemas (name)
    VALUES ($1) 
    RETURNING *;
    `,
    [name]
  );

  for(const bundle of bundles) {
    await pool.query(`
      INSERT INTO cinema_bundles (cinema_id, size) 
      VALUES ($1, $2);
    `,
      [cinema.rows[0].id, bundle]
    );
  }

  const bundleSize = await pool.query(`
    SELECT * FROM cinema_bundles 
    WHERE cinema_id=$1  
  `,
    [cinema.rows[0].id]
  );

  return {
    cinema: cinema.rows[0],
    bundleSize: bundleSize.rows
  };
}

export const deleteCinemaService = async (id: string) => {
  const result = await pool.query(`
    DELETE FROM cinemas WHERE id = $1
  `,
    [id]
  );

  if(result.rowCount === 0) throw new Error("cinema not found");

  return result;
}