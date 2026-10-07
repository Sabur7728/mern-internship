import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (location) params.set("location", location);

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_URL}/jobs?${params}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.message);
        setJobs(json.data);
      } catch (err) {
        setError(err.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    }, 300); // debounce typing

    return () => clearTimeout(timer);
  }, [search, location]);

  return (
    <div>
      <h1>Jobs</h1>
      <input placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} />
      <select value={location} onChange={(e) => setLocation(e.target.value)}>
        <option value="">All locations</option>
        <option>Bangalore</option>
        <option>Delhi</option>
        <option>Pune</option>
        <option>Mumbai</option>
      </select>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && jobs.length === 0 && <p>No jobs found.</p>}

      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            <strong>{job.title}</strong> at {job.company} ({job.location}), {job.employmentType}
          </li>
        ))}
      </ul>
    </div>
  );
}