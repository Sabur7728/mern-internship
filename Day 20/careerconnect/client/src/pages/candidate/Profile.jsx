import { useEffect, useState } from 'react';
import useFetch from '../../hooks/useFetch.js';
import { candidateApi } from '../../services/api.js';
import { Async } from '../../components/States.jsx';

export default function CandidateProfile() {
  const state = useFetch(() => candidateApi.me(), []);
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const c = state.data?.data;
    if (c) setForm({ name: c.name || '', phone: c.phone || '', location: c.location || '', skills: (c.skills || []).join(', '), experienceYears: c.experienceYears ?? 0, education: c.education || '', resumeUrl: c.resumeUrl || '', summary: c.summary || '' });
  }, [state.data]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setMsg(null);
    try { await candidateApi.updateMe(form); setMsg({ type: 'success', text: 'Profile saved' }); }
    catch (err) { setMsg({ type: 'error', text: err.message }); }
    finally { setSaving(false); }
  };

  return (
    <>
      <h1>My profile</h1>
      <Async state={state} isEmpty={false}>
        {form && (
          <form className="card form" onSubmit={onSubmit}>
            {msg && <div className={`alert ${msg.type}`}>{msg.text}</div>}
            <div className="two-col">
              <label>Name<input name="name" value={form.name} onChange={onChange} required /></label>
              <label>Phone<input name="phone" value={form.phone} onChange={onChange} placeholder="+91 9876543210" /></label>
              <label>Location<input name="location" value={form.location} onChange={onChange} /></label>
              <label>Experience (years)<input type="number" min="0" name="experienceYears" value={form.experienceYears} onChange={onChange} /></label>
              <label>Skills (comma separated)<input name="skills" value={form.skills} onChange={onChange} /></label>
              <label>Education<input name="education" value={form.education} onChange={onChange} /></label>
            </div>
            <label>Resume URL<input type="url" name="resumeUrl" value={form.resumeUrl} onChange={onChange} placeholder="https://..." /></label>
            <label>Summary<textarea rows="4" name="summary" value={form.summary} onChange={onChange} /></label>
            <button className="btn primary" disabled={saving}>{saving ? 'Saving...' : 'Save profile'}</button>
          </form>
        )}
      </Async>
    </>
  );
}
