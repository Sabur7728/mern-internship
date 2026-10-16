import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { roleHome } from "../utils/roles";

export default function Forbidden() {
  const { user } = useAuth();
  return (
    <div className="card narrow center">
      <h1>403</h1>
      <h2>Access Denied</h2>
      <p>You do not have permission to access this page.</p>
      <Link to={user ? roleHome[user.role] : "/login"}>Return to Dashboard</Link>
    </div>
  );
}