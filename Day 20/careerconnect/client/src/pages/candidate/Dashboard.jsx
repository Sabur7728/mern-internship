import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch.js';
import { applicationApi } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Async } from '../../components/States.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { APPLICATION_STATUSES } from '../../utils/constants.js';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const state = useFetch(() => applicationApi.list(), []);
  const apps = state.data?.data || [];
  const count = (s) => apps.filter((a) => a.status === s).length; // derived, not stored in state

  return (
    <>
      <h1>Welcome, {user.name}</h1>
      <div className="row"><Link className="btn primary" to="/jobs">Browse jobs</Link><Link className="btn" to="/candidate/profile">Edit profile</Link></div>
      <Async state={state} isEmpty={false}>
        <div className="stats">
          <div className="card stat"><b>{apps.length}</b><span>Total applications</span></div>
          {APPLICATION_STATUSES.slice(1).map((s) => <div key={s} className="card stat"><b>{count(s)}</b><span>{s}</span></div>)}
        </div>
        <h2>Recent applications</h2>
        {apps.length === 0 ? <p className="muted">You haven't applied to any job yet.</p> : (
          <div className="list">{apps.slice(0, 5).map((a) => (
            <div key={a._id} className="card row between">
              <div><b>{a.job?.title}</b><div className="muted">{a.job?.company?.name}</div></div>
              <StatusBadge status={a.status} />
            </div>
          ))}</div>
        )}
      </Async>
    </>
  );
}
