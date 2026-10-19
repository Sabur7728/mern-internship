import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const D = ['/dashboard', 'Dashboard'], ML = ['/my-leaves', 'My Leaves'];
const NAV = {
  admin: [D, ['/employees', 'Employees'], ['/departments', 'Departments'], ['/attendance', 'Attendance'], ['/leaves', 'Leave Requests'], ML, ['/admin/settings', 'Settings']],
  hr: [D, ['/employees', 'Employees'], ['/departments', 'Departments'], ['/attendance', 'Attendance'], ['/leaves', 'Leave Requests'], ML],
  employee: [D, ['/profile', 'My Profile'], ['/my-attendance', 'My Attendance'], ['/my-leaves', 'My Leave Requests']]
};
export default function Layout() {
  const { user, logout } = useAuth();
  return <div className="shell">
    <aside><h2>WorkSphere HR</h2>{NAV[user.role].map(([to, t]) => <NavLink key={to} to={to}>{t}</NavLink>)}</aside>
    <div className="main"><header><span>{user.name} <small className="muted">({user.role})</small></span><button className="btn sm" onClick={logout}>Logout</button></header><main><Outlet /></main></div>
  </div>;
}
