import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Handles both: login required, and (optionally) allowed roles
export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="center">Loading...</p>;

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children ?? <Outlet />;
}