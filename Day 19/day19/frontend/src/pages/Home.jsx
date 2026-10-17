import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main>
      <h1>Welcome to CareerConnect</h1>
      <p>Find your next job or hire great talent.</p>
      <Link to="/jobs">Browse jobs</Link>
    </main>
  );
}
