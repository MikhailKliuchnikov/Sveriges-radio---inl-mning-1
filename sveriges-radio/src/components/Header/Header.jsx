import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <nav>
      <NavLink to="/">Channels</NavLink>
      <NavLink to="/programs">Programs</NavLink>
      <NavLink to="/favorites">Favorites</NavLink>
    </nav>
  );
}