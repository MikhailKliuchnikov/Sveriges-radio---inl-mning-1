import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="app-header">
      <nav className="top-nav">
        <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
          Channels
        </NavLink>
        <NavLink to="/programs" className={({ isActive }) => (isActive ? "active" : "")}>
          Programs
        </NavLink>
        <NavLink to="/favorites" className={({ isActive }) => (isActive ? "active" : "")}>
          Favorites
        </NavLink>
      </nav>
    </header>
  );
}
