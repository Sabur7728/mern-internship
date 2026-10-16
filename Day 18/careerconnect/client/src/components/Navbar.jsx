import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = {
  candidate: [
    ["/candidate", "Home"],
    ["/candidate/jobs", "Jobs"],
    ["/candidate/applications", "My Applications"],
    ["/profile", "Profile"],
  ],
  recruiter: [
    ["/recruiter", "Dashboard"],
    ["/recruiter/jobs", "Jobs"],
    ["/recruiter/candidates", "Candidates"],
    ["/recruiter/applications", "Applications"],
    ["/profile", "Profile"],
  ],
  admin: [
    ["/admin", "Dashboard"],
    ["/admin/users", "Users"],
    ["/admin/companies", "Companies"],
    ["/admin/jobs", "Jobs"],
    ["/admin/candidates", "Candidates"],
    ["/admin/applications", "Applications"],
    ["/profile", "Profile"],
  ],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar">
      <strong>CareerConnect</strong>
      <div className="nav-links">
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        {user &&
          links[user.role].map(([to, label]) => (
            <Link key={to} to={to}>
              {label}
            </Link>
          ))}
        {user && (
          <>
            <span className="badge">{user.role}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}