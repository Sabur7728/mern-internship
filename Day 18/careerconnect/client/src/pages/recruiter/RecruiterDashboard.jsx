import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { jobService, applicationService } from "../../services/resources";
import Status from "../../components/Status";

const loadStats = async () => {
  const [jobs, apps] = await Promise.all([jobService.managed(), applicationService.managed()]);
  return {
    jobs: jobs.jobs.length,
    applications: apps.applications.length,
    pending: apps.applications.filter((a) => a.status === "pending").length,
  };
};

export default function RecruiterDashboard() {
  const { data, error, loading } = useFetch(loadStats);
  return (
    <div>
      <h2>Recruiter Dashboard</h2>
      <Status loading={loading} error={error} />
      {data && (
        <div className="grid">
          <div className="card"><h3>{data.jobs}</h3><p>My jobs</p><Link to="/recruiter/jobs">Manage</Link></div>
          <div className="card"><h3>{data.applications}</h3><p>Applications</p><Link to="/recruiter/applications">Review</Link></div>
          <div className="card"><h3>{data.pending}</h3><p>Pending review</p></div>
        </div>
      )}
    </div>
  );
}