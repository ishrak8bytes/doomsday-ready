import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/movies`);

        if(!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }

        const data = await res.json();

        setMovies(data);
      } catch (error) {
        if(error instanceof Error ? error.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, []);

  if(loading) return <p>Loading movies...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <ul>
      {movies.data.map((m) => (
        <li key={m.imdb_id}>
          <img src={m.poster} alt={m.tittle} width={100} />
          <Link to={`/movies/${m.id}`}>
            <h3>{m.title} ({m.year})</h3>
          </Link>
          <p>{m.genre} · {m.runtime} min · ⭐ {m.imdb_rating}</p>
          <p>{m.plot}</p>
        </li>
      ))}
    </ul>
  );
}