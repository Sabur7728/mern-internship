import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { jobService } from "../../services/resources";
import Status from "../../components/Status";

export default function CandidateJobs() {
  const { data, error, loading } = useFetch(jobService.list);
  return (
    <div>
      <h2>Available Jobs</h2>
      <Status loading={loading} error={error} />
      <div className="grid">
        {data?.jobs.filter((j) => j.status === "open").map((job) => (
          <div className="card" key={job._id}>
            <h3>{job.title}</h3>
            <p>{job.company?.name || "Independent"} - {job.location}</p>
            <p className="badge">{job.type}</p>
            <Link to={`/candidate/jobs/${job._id}`}>View details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}