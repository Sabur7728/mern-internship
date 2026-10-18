import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { applicationApi, jobApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Async } from '../components/States.jsx';
import { formatDate, formatSalary } from '../utils/format.js';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const state = useFetch(() => jobApi.get(id), [id]);
  const [msg, setMsg] = useState(null);
  const [applying, setApplying] = useState(false);
  const job = state.data?.data;

  const apply = async () => {
    setApplying(true); setMsg(null);
    try {
      await applicationApi.apply(id);
      setMsg({ type: 'success', text: 'Application submitted! Track it under My Applications.' });
    } catch (e) {
      setMsg({ type: 'error', text: e.message });
    } finally { setApplying(false); }
  };

  return (
    <Async state={state} isEmpty={!job}>
      {job && (
        <article className="card detail">
          <h1>{job.title}</h1>
          <p className="muted">{job.company?.name} • {job.location} • Posted {formatDate(job.createdAt)}</p>
          <div className="chips">
            <span className="chip">{job.employmentType}</span>
            <span className="chip">{job.experienceMin}+ yrs experience</span>
            <span className="chip">{formatSalary(job.salaryMin, job.salaryMax)}</span>
            <span className={`chip ${job.status === 'Open' ? 'ok' : 'bad'}`}>{job.status}</span>
          </div>
          <h3>Description</h3>
          <p className="pre">{job.description}</p>
          <h3>Skills</h3>
          <div className="chips">{job.skills.map((s) => <span key={s} className="chip skill">{s}</span>)}</div>
          {job.company?.description && <><h3>About {job.company.name}</h3><p>{job.company.description}</p></>}
          {msg && <div className={`alert ${msg.type}`}>{msg.text}</div>}
          <div className="row">
            {!user && <Link className="btn primary" to="/login" state={{ from: location.pathname }}>Login to apply</Link>}
            {user?.role === 'candidate' && job.status === 'Open' && (
              <button className="btn primary" onClick={apply} disabled={applying}>{applying ? 'Applying...' : 'Apply now'}</button>
            )}
            {user?.role === 'candidate' && <Link className="btn" to="/candidate/applications">My applications</Link>}
            <Link className="btn" to="/jobs">← Back to jobs</Link>
          </div>
        </article>
      )}
    </Async>
  );
}
