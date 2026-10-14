import { useEffect, useState } from "react";
import { getCandidates, updateCandidate } from "../services/candidateService";
import CandidateCard from "../components/CandidateCard";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import Pagination from "../components/Pagination";

const STATUSES = ["Applied", "Shortlisted", "Interview", "Hired", "Rejected"];

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [experience, setExperience] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await getCandidates({ search, status, experience, page, limit: 10 });
        if (cancelled) return;
        setCandidates(result.data);
        setPagination(result.pagination);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [search, status, experience, page]);

  const handleStatusChange = async (id, newStatus) => {
    setError("");
    try {
      const result = await updateCandidate(id, { status: newStatus });
      setCandidates((prev) => prev.map((c) => (c._id === id ? result.data : c)));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Candidates</h2>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        <input
          placeholder="Search name or email..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <input
          type="number"
          min="0"
          placeholder="Min experience (yrs)"
          value={experience}
          onChange={(e) => {
            setExperience(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {loading && <Loading text="Loading candidates..." />}
      <ErrorMessage message={error} />
      {!loading && !error && candidates.length === 0 && <p>No candidates found.</p>}

      {!loading &&
        candidates.map((c) => (
          <CandidateCard key={c._id} candidate={c} onStatusChange={handleStatusChange} />
        ))}

      <Pagination pagination={pagination} onPageChange={setPage} />
    </div>
  );
}