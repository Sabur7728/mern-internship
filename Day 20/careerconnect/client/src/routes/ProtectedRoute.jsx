import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Loading } from '../components/States.jsx';

// NOTE: this is UX only. Real security is enforced by the Express API.
export default function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (roles && !roles.includes(user.role)) {
    return <div className="container"><div className="alert error">403 – You do not have access to this page.</div></div>;
  }
  return <Outlet />;
}
