import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch.js';
import { adminApi } from '../../services/api.js';
import { Async } from '../../components/States.jsx';
import { formatDate } from '../../utils/format.js';

const CONFIG = {
  users: { title: 'Users', list: '/admin/users', remove: (r) => `/admin/users/${r._id}`, cols: [['name', 'Name'], ['email', 'Email'], ['role', 'Role'], ['status', 'Status'], ['createdAt', 'Joined', formatDate]] },
  companies: { title: 'Companies', list: '/admin/companies', remove: (r) => `/admin/companies/${r._id}`, cols: [['name', 'Name'], ['industry', 'Industry'], ['location', 'Location'], ['website', 'Website']] },
  jobs: { title: 'Jobs', list: '/admin/jobs', remove: (r) => `/jobs/${r._id}`, cols: [['title', 'Title'], ['company.name', 'Company'], ['recruiter.name', 'Recruiter'], ['location', 'Location'], ['status', 'Status']] },
  candidates: { title: 'Candidates', list: '/candidates', remove: (r) => `/candidates/${r._id}`, cols: [['name', 'Name'], ['email', 'Email'], ['location', 'Location'], ['experienceYears', 'Exp (yrs)'], ['skills', 'Skills', (v) => (v || []).join(', ')]] },
  applications: { title: 'Applications', list: '/applications', remove: (r) => `/applications/${r._id}`, cols: [['candidate.name', 'Candidate'], ['job.title', 'Job'], ['job.company.name', 'Company'], ['status', 'Status'], ['appliedAt', 'Applied', formatDate]] },
};
const getPath = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);

export default function AdminTable() {
  const { resource } = useParams();
  const cfg = CONFIG[resource];
  const [msg, setMsg] = useState('');
  const state = useFetch(() => (cfg ? adminApi.list(cfg.list, { limit: 100 }) : Promise.resolve(null)), [resource]);
  if (!cfg) return <Navigate to="/admin" replace />;
  const rows = state.data?.data || [];

  const remove = async (row) => {
    if (!window.confirm('Delete this record? This cannot be undone.')) return;
    try { await adminApi.remove(cfg.remove(row)); setMsg(''); state.reload(); } catch (e) { setMsg(e.message); }
  };
  const toggleStatus = async (row) => {
    try { await adminApi.update(`/admin/users/${row._id}`, { status: row.status === 'active' ? 'suspended' : 'active' }); state.reload(); } catch (e) { setMsg(e.message); }
  };

  return (
    <>
      <h1>{cfg.title}</h1>
      {msg && <div className="alert error">{msg}</div>}
      <Async state={state} isEmpty={!rows.length} emptyText={`No ${resource} found.`}>
        <div className="table-wrap"><table>
          <thead><tr>{cfg.cols.map(([, label]) => <th key={label}>{label}</th>)}<th>Actions</th></tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r._id}>
              {cfg.cols.map(([key, label, fmt]) => { const v = getPath(r, key); return <td key={label}>{fmt ? fmt(v) : v ?? '-'}</td>; })}
              <td className="actions">
                {resource === 'users' && <button className="btn small" onClick={() => toggleStatus(r)}>{r.status === 'active' ? 'Suspend' : 'Activate'}</button>}
                <button className="btn small danger" onClick={() => remove(r)}>Delete</button>
              </td>
            </tr>))}
          </tbody>
        </table></div>
      </Async>
    </>
  );
}
