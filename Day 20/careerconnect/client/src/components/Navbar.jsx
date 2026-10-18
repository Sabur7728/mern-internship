import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const LINKS = {
  candidate: [['/candidate', 'Dashboard'], ['/candidate/applications', 'My Applications'], ['/candidate/profile', 'Profile']],
  recruiter: [['/recruiter', 'Dashboard'], ['/recruiter/jobs', 'My Jobs'], ['/recruiter/applications', 'Applications'], ['/recruiter/candidates', 'Candidates']],
  admin: [['/admin', 'Dashboard'], ['/admin/users', 'Users'], ['/admin/companies', 'Companies'], ['/admin/jobs', 'Jobs'], ['/admin/candidates', 'Candidates'], ['/admin/applications', 'Applications']],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const handleLogout = async () => { await logout(); close(); navigate('/login'); };

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="brand" onClick={close}>Career<span>Connect</span></Link>
        <button className="menu-btn" aria-label="Toggle menu" onClick={() => setOpen((o) => !o)}>☰</button>
        <nav className={open ? 'nav-links open' : 'nav-links'}>
          <NavLink to="/jobs" onClick={close}>Jobs</NavLink>
          {user && LINKS[user.role].map(([to, label]) => (
            <NavLink key={to} to={to} end={to.split('/').length === 2} onClick={close}>{label}</NavLink>
          ))}
          {user ? (
            <>
              <span className="muted user-tag">{user.name} ({user.role})</span>
              <button className="btn small" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={close}>Login</NavLink>
              <Link to="/register" className="btn small primary" onClick={close}>Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
