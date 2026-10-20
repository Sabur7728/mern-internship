import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, homeFor } from '../context/AuthContext.jsx';
export default function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <div className="state"><div className="spin" />Loading...</div>;
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={homeFor(user)} replace />;
  return <Outlet />;
}
