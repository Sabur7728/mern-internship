import { useState } from 'react';
import useFetch from '../../hooks/useFetch.js';
import { applicationApi } from '../../services/api.js';
import { Async } from '../../components/States.jsx';
import { APPLICATION_STATUSES } from '../../utils/constants.js';
import { formatDate } from '../../utils/format.js';

function ApplicationRow({ app, onSaved }) {
  const [status, setStatus] = useState(app.status);
  const [notes, setNotes] = useState(app.recruiterNotes || '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const dirty = status !== app.status || notes !== (app.recruiterNotes || '');

  const save = async () => {
    setSaving(true); setMsg('');
    try { await applicationApi.update(app._id, { status, recruiterNotes: notes }); setMsg('Saved'); onSaved(); }
    catch (e) { setMsg(e.message); } finally { setSaving(false); }
  };

  return (
    <div className="card app-card">
      <div className="row between">
        <div>
          <h3>{app.candidate?.name} <span className="muted">→ {app.job?.title}</span></h3>
          <p className="muted">{app.candidate?.email} • {app.candidate?.location || 'Location n/a'} • {app.candidate?.experienceYears ?? 0} yrs • Applied {formatDate(app.appliedAt)}</p>
          <div className="chips">{app.candidate?.skills?.map((s) => <span key={s} className="chip skill">{s}</span>)}</div>
          {app.candidate?.resumeUrl && <p><a href={app.candidate.resumeUrl} target="_blank" rel="noreferrer">View resume</a></p>}
        </div>
      </div>
      <div className="two-col">
        <label>Status<select value={status} onChange={(e) => setStatus(e.target.value)}>{APPLICATION_STATUSES.map((s) => <option key={s}>{s}</option>)}</select></label>
        <label>Recruiter notes<textarea rows="2" value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
      </div>
      <div className="row"><button className="btn primary small" disabled={!dirty || saving} onClick={save}>{saving ? 'Saving...' : 'Save changes'}</button><span className="muted">{msg}</span></div>
    </div>
  );
}

export default function RecruiterApplications() {
  const [filter, setFilter] = useState('');
  const state = useFetch(() => applicationApi.list({ status: filter }), [filter]);
  const apps = state.data?.data || [];

  return (
    <>
      <div className="row between">
        <h1>Applications</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All statuses</option>{APPLICATION_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <Async state={state} isEmpty={!apps.length} emptyText="No applications found.">
        <div className="list">{apps.map((a) => <ApplicationRow key={a._id} app={a} onSaved={state.reload} />)}</div>
      </Async>
    </>
  );
}
