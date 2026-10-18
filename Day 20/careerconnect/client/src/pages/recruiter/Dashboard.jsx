import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch.js';
import { applicationApi, jobApi } from '../../services/api.js';
import { Async } from '../../components/States.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';

export default function RecruiterDashboard() {
  const jobs = useFetch(() => jobApi.mine(), []);
  const apps = useFetch(() => applicationApi.list(), []);
  const jobList = jobs.data?.data || [];
  const appList = apps.data?.data || [];

  return (
    <>
      <h1>Recruiter dashboard</h1>
      <div className="row"><Link className="btn primary" to="/recruiter/jobs/new">+ Post a job</Link><Link className="btn" to="/recruiter/applications">Review applications</Link></div>
      <Async state={jobs} isEmpty={false}>
        <div className="stats">
          <div className="card stat"><b>{jobList.length}</b><span>My jobs</span></div>
          <div className="card stat"><b>{jobList.filter((j) => j.status === 'Open').length}</b><span>Open jobs</span></div>
          <div className="card stat"><b>{appList.length}</b><span>Applications</span></div>
          <div className="card stat"><b>{appList.filter((a) => a.status === 'Applied').length}</b><span>Awaiting review</span></div>
        </div>
      </Async>
      <h2>Latest applications</h2>
      <Async state={apps} isEmpty={!appList.length} emptyText="No applications yet.">
        <div className="list">{appList.slice(0, 5).map((a) => (
          <div key={a._id} className="card row between">
            <div><b>{a.candidate?.name}</b> applied for <b>{a.job?.title}</b></div><StatusBadge status={a.status} />
          </div>))}
        </div>
      </Async>
    </>
  );
}
