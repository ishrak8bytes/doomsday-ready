import * as z from "zod";

export const MovieSchema = z.object({
  imdbId: z.string().max(20).nullable(),
  title: z.string().min(5, "Title should contain at least 5 characters"),
  year: z.string().nullable(),
  rated: z.string().max(20).nullable(),
  released: z.string().nullable(),
  runtime: z.number().min(1).max(300).nullable(),
  genre: z.string().nullable(),
  plot: z.string().nullable(),
  poster: z.url().nullable(),
  imdbRating: z.number().min(0).max(10).multipleOf(0.1).nullable(),
  movieType: z.string().max(30).nullable(),
});

export type Movie = z.infer<typeof MovieSchema>
