import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  return (
    <div style={{ border: "1px solid #ddd", padding: "1rem", marginBottom: "0.75rem" }}>
      <h3 style={{ margin: 0 }}>
        <Link to={`/jobs/${job._id}`}>{job.title}</Link>
      </h3>
      <p style={{ margin: "0.5rem 0" }}>
        {job.company} • {job.location} • {job.employmentType}
      </p>
      {job.skills?.length > 0 && <p style={{ margin: 0 }}>Skills: {job.skills.join(", ")}</p>}
    </div>
  );
}