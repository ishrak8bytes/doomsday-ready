import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function RewatchOrder() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/movies/${id}/rewatch-order`);
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);

        const json = await res.json();
        setData(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchOrder();
  }, [id]);

async function toggleWatched(movie) {
    const nextWatched = !movie.watched;
    setUpdatingId(movie.id);

    setData((prev) => {
      if (!prev) return prev;
      const order = prev.order.map((m) =>
        m.id === movie.id ? { ...m, watched: nextWatched } : m
      );
      const watchedCount = order.filter((m) => m.watched).length;
      return { ...prev, order, watchedCount };
    });

    try {
      const res = await fetch(`/api/movies/${movie.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ watched: nextWatched }),
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      const json = await res.json();
      
      setData((prev) => {
        if (!prev) return prev;
        const order = prev.order.map((m) =>
          m.id === movie.id ? { ...m, watched: json.data.watched } : m
        );
        const watchedCount = order.filter((m) => m.watched).length;
        return { ...prev, order, watchedCount };
      });
    } catch (err) {
      setData((prev) => {
        if (!prev) return prev;
        const order = prev.order.map((m) =>
          m.id === movie.id ? { ...m, watched: movie.watched } : m
        );
        const watchedCount = order.filter((m) => m.watched).length;
        return { ...prev, order, watchedCount };
      });
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>No data</p>;

  return (
    <div>
      <h1>Rewatch Order</h1>
      {data.total === 0 ? (
        <p>No movies in the rewatch order.</p>
      ) : (
        <>
         <p>
            {data.watchedCount} of {data.total} watched
          </p>

          <ol>
            {data.order.map((m) => (
              <li key={m.id}>
                <Link to={`/movies/${m.id}`}>
                  {m.title} ({m.year})
                </Link>{" "}
                · {m.runtime} min · {m.watched ? "✅ Watched" : "Not watched"}
                <button
                  onClick={() => toggleWatched(m)}
                  disabled={updatingId === m.id}
                >
                  {updatingId === m.id
                    ? "Saving…"
                    : m.watched
                    ? "Mark unwatched"
                    : "Mark watched"}
                </button>
              </li>
            ))}
          </ol>
      </>
      )}
     
    </div>
  );
}