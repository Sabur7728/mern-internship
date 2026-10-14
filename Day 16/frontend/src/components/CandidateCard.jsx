import { Link } from "react-router-dom";

const STATUSES = ["Applied", "Shortlisted", "Interview", "Hired", "Rejected"];

export default function CandidateCard({ candidate, onStatusChange }) {
  return (
    <div style={{ border: "1px solid #ddd", padding: "1rem", marginBottom: "0.75rem" }}>
      <h3 style={{ margin: 0 }}>
        <Link to={`/candidates/${candidate._id}`}>{candidate.name}</Link>
      </h3>
      <p style={{ margin: "0.5rem 0" }}>
        {candidate.email}
        {candidate.experience !== undefined && ` • ${candidate.experience} yrs`}
      </p>
      {candidate.skills?.length > 0 && (
        <p style={{ margin: "0 0 0.5rem" }}>Skills: {candidate.skills.join(", ")}</p>
      )}
      <label>
        Status:{" "}
        <select
          value={candidate.status || "Applied"}
          onChange={(e) => onStatusChange(candidate._id, e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
    </div>
  );
}