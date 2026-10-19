import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import { Badge, State } from '../components/UI';
import { fmtDate } from '../services/api';
export default function EmployeeDetail({ own }) {
  const p = useParams(), { employee, user } = useAuth();
  const id = own ? employee?._id : p.id;
  const { data: e, loading, error } = useFetch(id ? '/employees/' + id : '/auth/me');
  if (own && !id) return <p className="muted">No employee profile is linked to this account.</p>;
  const row = (k, v) => <div className="kv" key={k}><span>{k}</span><b>{v || '-'}</b></div>;
  const Sum = ({ t, o }) => <div className="card"><h3>{t}</h3>{Object.keys(o || {}).length ? Object.entries(o).map(([k, v]) => <span className="chip" key={k}>{k}: <b>{v}</b></span>) : <p className="muted">No records yet.</p>}</div>;
  return <State loading={loading} error={error}>{e && e.employeeId && <>
    <div className="row"><h1>{e.firstName} {e.lastName} <Badge v={e.status} /></h1>{!own && user.role !== 'employee' && <Link className="btn" to={`/employees/${e._id}/edit`}>Edit</Link>}</div>
    <div className="grid2"><div className="card"><h3>Employment</h3>{[['Employee ID', e.employeeId], ['Department', e.department?.name], ['Designation', e.designation], ['Type', e.employmentType], ['Joined', fmtDate(e.joiningDate)], ['Tenure', e.tenure], ['Manager', e.manager]].map(([k, v]) => row(k, v))}</div>
      <div className="card"><h3>Personal & contact</h3>{[['Email', e.email], ['Phone', e.phone], ['Date of birth', fmtDate(e.dateOfBirth)], ['Gender', e.gender], ['Address', [e.address, e.city, e.state, e.postalCode].filter(Boolean).join(', ')]].map(([k, v]) => row(k, v))}</div>
      <Sum t="Attendance summary" o={e.attendanceSummary} /><Sum t="Leave summary" o={e.leaveSummary} /></div></>}</State>;
}
