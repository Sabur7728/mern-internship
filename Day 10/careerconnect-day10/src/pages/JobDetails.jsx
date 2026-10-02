import { Link, useParams } from "react-router";

function JobDetails() {
  const { jobId } = useParams();

  return (
    <div className="page">
      <h1>Job Details</h1>

      <div className="card">
        <h2>Job ID: {jobId}</h2>

        <p>
          This is the details page for job:
          <strong> {jobId}</strong>
        </p>

        <p>
          Later we will fetch this job from API.
        </p>

        <Link to="/jobs">
          ← Back to Jobs
        </Link>
      </div>
    </div>
  );
}

export default JobDetails;