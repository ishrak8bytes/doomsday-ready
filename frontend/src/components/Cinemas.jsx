import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Cinemas() {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    async function fetchCinemas() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/cinemas`);

        if(!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }

        const data = await res.json();
        setCinemas(data);
      } catch (error) {
        if(error instanceof Error ? error.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchCinemas();
  }, []);

  if(loading) return <p>Loading cinemas...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <ul>
      {cinemas.data.map((c) => (
        <li key={c.id}>
          <Link to={`/cinemas/${c.id}`}>
            <h2>{c.name}</h2>
          </Link>
        </li>
      ))}
    </ul>
  );
}