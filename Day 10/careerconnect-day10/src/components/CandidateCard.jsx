import { Link } from "react-router";

function CandidateCard({ candidate }) {
  return (
    <article className="candidate-card">
      <h3>{candidate.name}</h3>

      <p>{candidate.position}</p>

      <p>{candidate.location}</p>

      <p>
        {candidate.experience} years experience
      </p>

      <strong className="status">
        {candidate.status}
      </strong>

      <div className="skills">
        {candidate.skills.map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>

      <Link
        className="btn"
        to={`/candidates/${candidate.id}`}
      >
        View Details
      </Link>
    </article>
  );
}

export default CandidateCard;