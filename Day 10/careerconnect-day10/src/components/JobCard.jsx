import { Link } from "react-router";

function JobCard({ job }) {
  return (
    <article className="job-card">
      <h3>{job.title}</h3>

      <p>
        <strong>Company:</strong> {job.company}
      </p>

      <p>
        <strong>Location:</strong> {job.location}
      </p>

      <p>
        <strong>Experience:</strong> {job.experience}
      </p>

      <p>
        <strong>Salary:</strong> {job.salary}
      </p>

      <div className="skills">
        {job.skills.map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>

      <Link
        className="btn"
        to={`/jobs/${job.id}`}
      >
        View Details
      </Link>
    </article>
  );
}

export default JobCard;
