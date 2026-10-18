import { useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch.js';
import { jobApi } from '../../services/api.js';
import { Async } from '../../components/States.jsx';
import { formatDate } from '../../utils/format.js';

export default function MyJobs() {
  const state = useFetch(() => jobApi.mine(), []);
  const [msg, setMsg] = useState('');
  const jobs = state.data?.data || [];

  const remove = async (job) => {
    if (!window.confirm(`Delete "${job.title}" and all its applications?`)) return;
    try { await jobApi.remove(job._id); setMsg(''); state.reload(); } catch (e) { setMsg(e.message); }
  };
  const toggle = async (job) => {
    try { await jobApi.update(job._id, { status: job.status === 'Open' ? 'Closed' : 'Open' }); state.reload(); } catch (e) { setMsg(e.message); }
  };

  return (
    <>
      <div className="row between"><h1>My jobs</h1><Link to="/recruiter/jobs/new" className="btn primary">+ New job</Link></div>
      {msg && <div className="alert error">{msg}</div>}
      <Async state={state} isEmpty={!jobs.length} emptyText="You have not posted any jobs yet.">
        <div className="table-wrap"><table>
          <thead><tr><th>Title</th><th>Company</th><th>Location</th><th>Status</th><th>Applicants</th><th>Posted</th><th>Actions</th></tr></thead>
          <tbody>{jobs.map((j) => (
            <tr key={j._id}>
              <td><Link to={`/jobs/${j._id}`}>{j.title}</Link></td><td>{j.company?.name}</td><td>{j.location}</td>
              <td><span className={`chip ${j.status === 'Open' ? 'ok' : 'bad'}`}>{j.status}</span></td>
              <td>{j.applicationCount}</td><td>{formatDate(j.createdAt)}</td>
              <td className="actions">
                <Link className="btn small" to={`/recruiter/jobs/${j._id}/edit`}>Edit</Link>
                <button className="btn small" onClick={() => toggle(j)}>{j.status === 'Open' ? 'Close' : 'Reopen'}</button>
                <button className="btn small danger" onClick={() => remove(j)}>Delete</button>
              </td>
            </tr>))}
          </tbody>
        </table></div>
      </Async>
    </>
  );
}
