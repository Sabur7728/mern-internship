import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch.js';
import { adminApi } from '../../services/api.js';
import { Async } from '../../components/States.jsx';

export default function AdminDashboard() {
  const state = useFetch(() => adminApi.stats(), []);
  const s = state.data?.data;
  return (
    <>
      <h1>Admin dashboard</h1>
      <Async state={state} isEmpty={!s}>
        {s && (
          <>
            <div className="stats">
              {[['Users', s.users], ['Companies', s.companies], ['Jobs', s.jobs], ['Candidates', s.candidates], ['Applications', s.applications]].map(([k, v]) => (
                <div key={k} className="card stat"><b>{v}</b><span>{k}</span></div>))}
            </div>
            <div className="two-col">
              <div className="card"><h3>Users by role</h3>{Object.entries(s.usersByRole).map(([k, v]) => <p key={k}>{k}: <b>{v}</b></p>)}</div>
              <div className="card"><h3>Applications by status</h3>{Object.entries(s.applicationsByStatus).map(([k, v]) => <p key={k}>{k}: <b>{v}</b></p>)}</div>
            </div>
            <div className="row">{['users', 'companies', 'jobs', 'candidates', 'applications'].map((r) => <Link key={r} className="btn" to={`/admin/${r}`}>Manage {r}</Link>)}</div>
          </>
        )}
      </Async>
    </>
  );
}
