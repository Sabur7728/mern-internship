import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { userService, jobService, companyService, applicationService } from "../../services/resources";
import Status from "../../components/Status";

const loadStats = async () => {
  const [u, j, c, a] = await Promise.all([
    userService.list(), jobService.managed(), companyService.list(), applicationService.managed(),
  ]);
  return { users: u.users.length, jobs: j.jobs.length, companies: c.companies.length, applications: a.applications.length };
};

export default function AdminDashboard() {
  const { data, error, loading } = useFetch(loadStats);
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <Status loading={loading} error={error} />
      {data && (
        <div className="grid">
          <div className="card"><h3>{data.users}</h3><p>Users</p><Link to="/admin/users">Manage</Link></div>
          <div className="card"><h3>{data.companies}</h3><p>Companies</p><Link to="/admin/companies">Manage</Link></div>
          <div className="card"><h3>{data.jobs}</h3><p>Jobs</p><Link to="/admin/jobs">Review</Link></div>
          <div className="card"><h3>{data.applications}</h3><p>Applications</p><Link to="/admin/applications">Review</Link></div>
        </div>
      )}
    </div>
  );
}