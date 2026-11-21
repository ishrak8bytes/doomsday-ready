export interface IMovie {
  imdbId: string | null;
  title: string;
  year: string | null;
  rated: string | null;
  released: string | null;
  runtime: number | null;
  genre: string | null;
  plot: string | null;
  poster: string | null;
  imdbRating: number | null;
  movieType: string | null;
}

export interface IUpdateMovie {
  movieBody: Partial<IMovie>;
  watched: boolean;
  preRequisiteIds: string[];
}