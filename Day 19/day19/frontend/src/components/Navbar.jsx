import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <nav className="top" aria-label="Main">
      <Link to="/">CareerConnect</Link>
      <Link to="/jobs">Jobs</Link>
      {user && ["recruiter", "admin"].includes(user.role) && <Link to="/dashboard">Dashboard</Link>}
      <span className="spacer" />
      {user ? (
        <>
          <span style={{ color: "#fff" }}>{user.name} ({user.role})</span>
          <button onClick={() => { logout(); navigate("/login"); }}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}
