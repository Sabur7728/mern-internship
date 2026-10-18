import { useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch.js';
import { applicationApi } from '../../services/api.js';
import { Async } from '../../components/States.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { formatDate } from '../../utils/format.js';

export default function CandidateApplications() {
  const state = useFetch(() => applicationApi.list(), []);
  const [msg, setMsg] = useState('');
  const apps = state.data?.data || [];

  const withdraw = async (id) => {
    if (!window.confirm('Withdraw this application?')) return;
    try { await applicationApi.remove(id); setMsg(''); state.reload(); } catch (e) { setMsg(e.message); }
  };

  return (
    <>
      <h1>My applications</h1>
      {msg && <div className="alert error">{msg}</div>}
      <Async state={state} isEmpty={!apps.length} emptyText="You have not applied to any jobs yet.">
        <div className="table-wrap"><table>
          <thead><tr><th>Job</th><th>Company</th><th>Applied</th><th>Status</th><th /></tr></thead>
          <tbody>{apps.map((a) => (
            <tr key={a._id}>
              <td><Link to={`/jobs/${a.job?._id}`}>{a.job?.title}</Link></td>
              <td>{a.job?.company?.name}</td>
              <td>{formatDate(a.appliedAt)}</td>
              <td><StatusBadge status={a.status} /></td>
              <td>{a.status === 'Applied' && <button className="btn small danger" onClick={() => withdraw(a._id)}>Withdraw</button>}</td>
            </tr>))}
          </tbody>
        </table></div>
      </Async>
    </>
  );
}
