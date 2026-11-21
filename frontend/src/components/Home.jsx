import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MIN_RATING = 8.1;

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/movies");
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);

        const json = await res.json();
        setMovies(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, []);

  const topRated = movies
    .filter((m) => m.imdb_rating >= MIN_RATING)
    .sort((a, b) => b.imdb_rating - a.imdb_rating);

  return (
    <div>
      <header className="hero">
        <h1>Doomsday Ready</h1>
        <p>Your movie watchlist, curated.</p>
      </header>

      <section className="section">
        <div className="section-header">
          <h2>Top Rated ({MIN_RATING}+)</h2>
          <Link to="/movies" className="see-more">
            See more →
          </Link>
        </div>

        {loading && <p>Loading…</p>}
        {error && <p>Error: {error}</p>}

        {!loading && !error && topRated.length === 0 && (
          <p>No movies rated {MIN_RATING} or higher yet.</p>
        )}

        {!loading && !error && topRated.length > 0 && (
          <ul className="movie-grid">
            {topRated.map((m) => (
              <li key={m.id} className="movie-card">
                <Link to={`/movies/${m.id}`}>
                  <img src={m.poster} alt={m.title} />
                  <h3>{m.title}</h3>
                  <p>
                    {m.year} · ⭐ {m.imdb_rating}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}