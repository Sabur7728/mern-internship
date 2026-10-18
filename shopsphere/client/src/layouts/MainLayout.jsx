import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { applyTheme, getTheme } from '../utils/theme';
import { useCart } from '../context/CartContext';
export default function MainLayout() {
  const { user, logout } = useAuth();
  const { calculateTotals } = useCart();
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(getTheme());
  const flip = () => { const t = theme === 'dark' ? 'light' : 'dark'; applyTheme(t); setTheme(t); };
  return (
    <>
      <header className="nav">
        <Link to="/" className="logo">ShopSphere</Link>
        <button className="burger" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
        <form className="search" onSubmit={(e) => { e.preventDefault(); nav(`/products?search=${encodeURIComponent(q)}`); }}>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" aria-label="Search" />
        </form>
        <nav className={open ? 'open' : ''} onClick={() => setOpen(false)}>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/cart">Cart ({calculateTotals().count})</NavLink>
          {user ? <>
            {user.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
            <NavLink to="/wishlist">Wishlist</NavLink><NavLink to="/orders">My orders</NavLink><NavLink to="/profile">{user.name.split(' ')[0]}</NavLink>
            <a href="#" onClick={(e) => { e.preventDefault(); logout(); nav('/'); }}>Logout</a>
          </> : <><NavLink to="/login">Login</NavLink><NavLink to="/register">Register</NavLink></>}
        </nav>
        <button className="theme" onClick={flip} aria-label="Toggle dark/light theme">{theme === 'dark' ? '☀' : '☾'}</button>
      </header>
      <main><Outlet /></main>
      <footer className="footer">© {new Date().getFullYear()} ShopSphere · Free shipping above ₹999</footer>
    </>
  );
}
