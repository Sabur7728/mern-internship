import { memo } from "react";
import { Link } from "react-router-dom";

function JobCard({ job }) {
  return (
    <article className="job-card">
      <h3>{job.title}</h3>
      <p>{job.company} · {job.location}</p>
      <p>Experience: {job.experience} yrs · Salary: ₹{Number(job.salary).toLocaleString("en-IN")}</p>
      <Link to={`/jobs/${job._id}`} aria-label={`View details for ${job.title}`}>View details</Link>
    </article>
  );
}

export default memo(JobCard);
