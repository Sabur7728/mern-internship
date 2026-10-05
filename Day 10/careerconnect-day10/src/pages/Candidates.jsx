import { Link } from "react-router";

function Candidates() {
  const candidates = [
    {
      id: 1,
      name: "Rahul Sharma",
      position: "MERN Stack Developer",
      status: "Interview",
    },
    {
      id: 2,
      name: "Priya Singh",
      position: "Frontend Developer",
      status: "Shortlisted",
    },
    {
      id: 3,
      name: "Amit Kumar",
      position: "Backend Developer",
      status: "Applied",
    },
  ];

  return (
    <div className="page">
      <h1>Candidates</h1>

      <Link className="button" to="/candidates/new">
        + Add Candidate
      </Link>

      <div className="card-grid">
        {candidates.map((candidate) => (
          <div className="card" key={candidate.id}>
            <h2>{candidate.name}</h2>

            <p>{candidate.position}</p>

            <p>Status: {candidate.status}</p>

            <Link
              to={`/candidates/${candidate.id}`}
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Candidates;