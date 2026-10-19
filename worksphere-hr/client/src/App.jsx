import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './layouts/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import EmployeeForm from './pages/EmployeeForm';
import EmployeeDetail from './pages/EmployeeDetail';
import Departments from './pages/Departments';
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';
import Settings from './pages/Settings';

function Guard({ roles, children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="muted center">Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}
const HR = ['admin', 'hr'];
export default function App() {
  return <Routes>
    <Route path="/login" element={<Login />} />
    <Route element={<Guard><Layout /></Guard>}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/employees" element={<Guard roles={HR}><Employees /></Guard>} />
      <Route path="/employees/new" element={<Guard roles={HR}><EmployeeForm /></Guard>} />
      <Route path="/employees/:id/edit" element={<Guard roles={HR}><EmployeeForm /></Guard>} />
      <Route path="/employees/:id" element={<Guard roles={HR}><EmployeeDetail /></Guard>} />
      <Route path="/departments" element={<Guard roles={HR}><Departments /></Guard>} />
      <Route path="/attendance" element={<Guard roles={HR}><Attendance /></Guard>} />
      <Route path="/my-attendance" element={<Attendance mine />} />
      <Route path="/leaves" element={<Guard roles={HR}><Leaves /></Guard>} />
      <Route path="/my-leaves" element={<Leaves mine />} />
      <Route path="/profile" element={<EmployeeDetail own />} />
      <Route path="/admin/settings" element={<Guard roles={['admin']}><Settings /></Guard>} />
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>;
}
