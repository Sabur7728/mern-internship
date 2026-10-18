import { Link } from 'react-router-dom';
export default function NotFound() {
  return <div className="center-state"><h2>404 – Page not found</h2><Link to="/" className="btn primary">Go home</Link></div>;
}
