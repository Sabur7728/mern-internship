import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isStaff = isAuthenticated && ["recruiter", "admin"].includes(user.role);

  return (
    <nav
      style={{
        display: "flex",
        gap: "1rem",
        padding: "1rem",
        borderBottom: "1px solid #ddd",
        flexWrap: "wrap",
      }}
    >
      <Link to="/">Home</Link>
      <Link to="/jobs">Jobs</Link>

      {isAuthenticated && user.role === "candidate" && (
        <Link to="/applications">My Applications</Link>
      )}

      {isStaff && (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/candidates">Candidates</Link>
          <Link to="/jobs/new">Create Job</Link>
          <Link to="/recruiter/applications">Applications</Link>
        </>
      )}

      <span style={{ marginLeft: "auto" }}>
        {isAuthenticated ? (
          <>
            {user.name} ({user.role}) <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link> <Link to="/register">Register</Link>
          </>
        )}
      </span>
    </nav>
  );
}