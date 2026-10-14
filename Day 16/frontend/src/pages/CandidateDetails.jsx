import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCandidateById } from "../services/candidateService";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

export default function CandidateDetails() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getCandidateById(id);
        setCandidate(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Loading text="Loading candidate..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!candidate) return <p>Candidate not found.</p>;

  return (
    <div>
      <Link to="/candidates">&larr; Back to candidates</Link>
      <h2>{candidate.name}</h2>
      <p>Email: {candidate.email}</p>
      {candidate.phone && <p>Phone: {candidate.phone}</p>}
      {candidate.location && <p>Location: {candidate.location}</p>}
      {candidate.experience !== undefined && <p>Experience: {candidate.experience} years</p>}
      {candidate.skills?.length > 0 && <p>Skills: {candidate.skills.join(", ")}</p>}
      <p>Status: {candidate.status || "Applied"}</p>
    </div>
  );
}