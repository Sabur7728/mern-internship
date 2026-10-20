import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const links = !user || user.role === 'customer'
    ? [['/', 'Home'], ['/restaurants', 'Restaurants'], ...(user ? [['/orders', 'Orders'], ['/profile', 'Profile']] : [])]
    : user.role === 'restaurant'
      ? [['/restaurant/dashboard', 'Dashboard'], ['/restaurant/profile', 'Restaurant'], ['/restaurant/menu', 'Menu'], ['/restaurant/orders', 'Orders']]
      : [['/admin/dashboard', 'Dashboard'], ['/admin/restaurants', 'Restaurants'], ['/admin/users', 'Users'], ['/admin/orders', 'Orders']];
  const showCart = !user || user.role === 'customer';
  return (
    <header className="nav">
      <div className="wrap nav-in">
        <Link to="/" className="logo">food<span>flow</span></Link>
        <span className="loc">📍 Delivering in Nanded</span>
        <button className="burger" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
        <nav className={open ? 'open' : ''} onClick={() => setOpen(false)}>
          {links.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>)}
          {showCart && <NavLink to="/cart" className="cartlink">Cart{count > 0 && <em>{count}</em>}</NavLink>}
          {user ? <button className="btn sm ghost-w" onClick={() => { logout(); nav('/'); }}>Log out ({user.name.split(' ')[0]})</button>
            : <><Link className="btn sm ghost-w" to="/login">Log in</Link><Link className="btn sm mint" to="/register">Sign up</Link></>}
        </nav>
      </div>
    </header>
  );
}
