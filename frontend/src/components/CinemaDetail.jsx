import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


export default function CinemaDetail() {
  const { id } = useParams();

  const [groupSize, setGroupSize] = useState("");
  const [booking, setBooking] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  const [cinema, setCinema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function handleBookingSubmit(e) {
    e.preventDefault();
    setBookingLoading(true);
    setBookingError(null);
    setBooking(null);

    try {
      const res = await fetch(
        `/api/cinemas/${id}/booking?groupSize=${encodeURIComponent(groupSize)}`
      );
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      const json = await res.json();
      setBooking(json.data);
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBookingLoading(false);
    }
  }

  useEffect(() => {
    async function fetchCinema() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/cinemas/${id}`);
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);

        const json = await res.json();
        setCinema(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchCinema();
  }, [id]);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error}</p>;
  if (!cinema) return <p>Cinema not found</p>;

  return (
    <div>
      <h1>{cinema.name}</h1>
      <h2>Bundle sizes</h2>
      <ul>
        {cinema.bundles.map((size) => (   
          <li key={size}>{size}</li>
        ))}
      </ul>

      <h2>Check booking</h2>
      <form onSubmit={handleBookingSubmit}>
        <label>
          Group size:{" "}
          <input
            type="number"
            min="1"
            required
            value={groupSize}
            onChange={(e) => setGroupSize(e.target.value)}
          />
        </label>{" "}
        <button type="submit" disabled={bookingLoading}>
          {bookingLoading ? "Checking…" : "Check"}
        </button>
      </form>

      {bookingError && <p>Error: {bookingError}</p>}

      {booking && (
        <div>
          <h3>Result</h3>
          <p>
            Cinema: {booking.cinemaName} · Group size: {booking.groupSize}
          </p>
          <p>Possible: {booking.possible ? "Yes" : "No"}</p>
          {booking.minimum &&  <p>Minimum bundle size: {booking.minimum}</p>}
          {/* <p>Minimum bundle size: {booking.minimum}</p> */}

          {booking.possible && booking.combination && (
            <>
              <p>Combination used:</p>
              <ul>
                {Object.entries(booking.combination).map(([size, count]) => (
                  <li key={size}>
                    Bundle {size} x {count}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}