function CandidateCard({ candidate }) {
  return (
    <div className="candidate-card">
      <div className="candidate-top">
        <div>
          <h3>{candidate.name}</h3>
          <p>{candidate.email}</p>
        </div>

        <span className={`status ${candidate.status.toLowerCase()}`}>
          {candidate.status}
        </span>
      </div>

      <div className="candidate-info">
        <p>
          <strong>Position:</strong> {candidate.position}
        </p>

        <p>
          <strong>Experience:</strong> {candidate.experience} years
        </p>

        <p>
          <strong>Location:</strong> {candidate.location}
        </p>
      </div>

      <div className="skills">
        {candidate.skills.map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>
    </div>
  );
}

export default CandidateCard;