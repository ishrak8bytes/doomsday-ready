import { Routes, Route } from "react-router-dom";
import Cinemas from "./components/Cinemas";
import CinemaDetail from "./components/CinemaDetail";
import Movies from "./components/Movies";
import MovieDetail from "./components/MovieDetails";
import RewatchOrder from "./components/RewatchOrder";
import Navbar from "./components/NavBar";
import Home from "./components/Home";

export default function App() {
  return (
    <>
    <Navbar />
      <main className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/movies/:id/rewatch-order" element={<RewatchOrder />} />
          <Route path="/cinemas" element={<Cinemas />} />
          <Route path="/cinemas/:id" element={<CinemaDetail />} />
        </Routes>
      </main>
    </>
  );
}