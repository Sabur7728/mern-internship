import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useFetch from "../../hooks/useFetch";
import { jobService, applicationService } from "../../services/resources";
import Status from "../../components/Status";

const loadStats = async () => {
  const [jobs, apps] = await Promise.all([jobService.list(), applicationService.mine()]);
  return { jobs: jobs.jobs.length, applications: apps.applications.length };
};

export default function CandidateDashboard() {
  const { user } = useAuth();
  const { data, error, loading } = useFetch(loadStats);

  return (
    <div>
      <h2>Welcome, {user.name}</h2>
      <Status loading={loading} error={error} />
      {data && (
        <div className="grid">
          <div className="card"><h3>{data.jobs}</h3><p>Available jobs</p><Link to="/candidate/jobs">Browse</Link></div>
          <div className="card"><h3>{data.applications}</h3><p>My applications</p><Link to="/candidate/applications">View</Link></div>
        </div>
      )}
    </div>
  );
}