import { NavLink } from "react-router";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        CareerConnect
      </div>

      <div className="nav-links">
        <NavLink to="/">Home</NavLink>

        <NavLink to="/dashboard">
          Dashboard
        </NavLink>

        <NavLink to="/jobs">
          Jobs
        </NavLink>

        <NavLink to="/candidates">
          Candidates
        </NavLink>

        <NavLink to="/login">
          Login
        </NavLink>

        <NavLink to="/register">
          Register
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;