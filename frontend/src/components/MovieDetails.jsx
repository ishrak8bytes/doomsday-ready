import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


export default function MovieDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [movieDetail, setMovieDetail] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMovie() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/movies/${id}`);
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);

        const json = await res.json();
     
        setMovieDetail(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchMovie();
  }, [id]);

  async function toggleWatched() {
    const nextWatched = !movieDetail.watched;
    setUpdating(true);

    setMovieDetail((prev) => (prev ? { ...prev, watched: nextWatched } : prev));

    try {
      const res = await fetch(`/api/movies/${movieDetail.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ watched: nextWatched }),
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      const json = await res.json();
      setMovieDetail((prev) =>
        prev ? { ...prev, watched: json.data.watched } : prev
      );
    } catch (err) {
      setMovieDetail((prev) =>
        prev ? { ...prev, watched: movieDetail.watched } : prev
      );
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error}</p>;
  if (!movieDetail) return <p>Movie not found</p>;

  return (
    <div>
      <img src={movieDetail.poster} alt={movieDetail.title} width={200} />
      <h1>{movieDetail.title} ({movieDetail.year})</h1>
      <p>{movieDetail.rated} · {movieDetail.runtime} min · ⭐ {movieDetail.imdb_rating}</p>
      <p>{movieDetail.genre}</p>
      <p>{movieDetail.released}</p>
      <p>{movieDetail.plot}</p>
      <p>Watched: {movieDetail.watched ? "Yes" : "No"}</p>
      <button onClick={() => navigate(`/movies/${movieDetail.id}/rewatch-order`)}>
        View rewatch order
      </button>
      <button onClick={toggleWatched} disabled={updating}>
        {updating
          ? "Saving…"
          : movieDetail.watched
          ? "Mark unwatched"
          : "Mark watched"}
      </button>
      <h2>Prerequisites</h2>
      {movieDetail.preRequisites.length > 0 ? (
        <ul>
          {movieDetail.preRequisites.map((p) => (
            <li key={p.id}>{p.title}</li>
          ))}
        </ul>
      ) : (
        <p>No prerequisites</p>
      )}
    </div>
  );
}