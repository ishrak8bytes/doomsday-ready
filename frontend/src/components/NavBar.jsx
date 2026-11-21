import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar" style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "5rem",
    }}>
      <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
        Home
      </NavLink>
      <NavLink to="/movies" className={({ isActive }) => (isActive ? "active" : "")}>
        Movies
      </NavLink>
      <NavLink to="/cinemas" className={({ isActive }) => (isActive ? "active" : "")}>
        Cinemas
      </NavLink>
    </nav>
  );
}