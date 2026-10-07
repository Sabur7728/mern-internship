import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_URL}/candidates?${params}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.message);
        setCandidates(json.data);
      } catch (err) {
        setError(err.message || "Failed to load candidates");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, status]);

  return (
    <div>
      <h1>Candidates</h1>
      <Link to="/candidates/add">+ Add Candidate</Link>

      <div style={{ margin: "16px 0" }}>
        <input
          placeholder="Search name, email, skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option>Applied</option>
          <option>Interview</option>
          <option>Hired</option>
          <option>Rejected</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && candidates.length === 0 && <p>No candidates found.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {candidates.map((c) => (
          <li key={c.id} style={{ marginBottom: 8 }}>
            <strong>{c.name}</strong> | {c.position} | {c.location} | {c.status}
          </li>
        ))}
      </ul>
    </div>
  );
}