import { Link, useParams } from "react-router";

function CandidateDetails() {
  const { candidateId } = useParams();

  return (
    <div className="page">
      <h1>Candidate Details</h1>

      <div className="card">
        <h2>
          Candidate ID: {candidateId}
        </h2>

        <p>
          This page is displaying candidate:
          <strong> {candidateId}</strong>
        </p>

        <p>
          Later we will fetch candidate details
          using an API.
        </p>

        <Link to="/candidates">
          ← Back to Candidates
        </Link>
      </div>
    </div>
  );
}

export default CandidateDetails;