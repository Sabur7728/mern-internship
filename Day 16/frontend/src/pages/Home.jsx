import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div>
      <h1>CareerConnect</h1>
      <p>Find jobs and manage your recruitment process in one place.</p>

      {isAuthenticated ? (
        <p>
          Welcome back, <strong>{user.name}</strong> ({user.role}).
        </p>
      ) : (
        <p>
          <Link to="/login">Login</Link> or <Link to="/register">Register</Link> to get started.
        </p>
      )}

      <Link to="/jobs">Browse jobs</Link>
    </div>
  );
}