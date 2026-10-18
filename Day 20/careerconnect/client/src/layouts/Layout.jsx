import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="container"><Outlet /></main>
      <footer className="footer">© {new Date().getFullYear()} CareerConnect – MERN Stack Final Project</footer>
    </>
  );
}
