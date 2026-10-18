import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch.js';
import { jobApi } from '../../services/api.js';
import { Async } from '../../components/States.jsx';
import { EMPLOYMENT_TYPES } from '../../utils/constants.js';

const INITIAL = { title: '', companyName: '', description: '', location: '', employmentType: 'Full-time', experienceMin: 0, salaryMin: 0, salaryMax: 0, skills: '', status: 'Open' };

export default function JobForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const state = useFetch(() => (isEdit ? jobApi.get(id) : Promise.resolve(null)), [id]);

  useEffect(() => {
    const j = state.data?.data;
    if (j) setForm({ title: j.title, companyName: j.company?.name || '', description: j.description, location: j.location, employmentType: j.employmentType, experienceMin: j.experienceMin, salaryMin: j.salaryMin, salaryMax: j.salaryMax, skills: j.skills.join(', '), status: j.status });
  }, [state.data]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (form.title.trim().length < 3) return setError('Title must be at least 3 characters');
    if (form.description.trim().length < 10) return setError('Description must be at least 10 characters');
    if (!form.location.trim()) return setError('Location is required');
    if (!isEdit && !form.companyName.trim()) return setError('Company name is required');
    if (Number(form.salaryMax) < Number(form.salaryMin)) return setError('Maximum salary cannot be lower than minimum salary');
    setSaving(true);
    try {
      if (isEdit) { const { companyName, ...rest } = form; await jobApi.update(id, rest); } else await jobApi.create(form);
      navigate('/recruiter/jobs');
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  };

  return (
    <>
      <h1>{isEdit ? 'Edit job' : 'Post a new job'}</h1>
      <Async state={state} isEmpty={false}>
        <form className="card form" onSubmit={onSubmit}>
          {error && <div className="alert error">{error}</div>}
          <div className="two-col">
            <label>Job title<input name="title" value={form.title} onChange={onChange} required /></label>
            <label>Company<input name="companyName" value={form.companyName} onChange={onChange} disabled={isEdit} required={!isEdit} /></label>
            <label>Location<input name="location" value={form.location} onChange={onChange} required /></label>
            <label>Employment type
              <select name="employmentType" value={form.employmentType} onChange={onChange}>{EMPLOYMENT_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
            </label>
            <label>Min experience (years)<input type="number" min="0" max="50" name="experienceMin" value={form.experienceMin} onChange={onChange} /></label>
            <label>Skills (comma separated)<input name="skills" value={form.skills} onChange={onChange} placeholder="React, Node.js" /></label>
            <label>Min salary (₹/yr)<input type="number" min="0" name="salaryMin" value={form.salaryMin} onChange={onChange} /></label>
            <label>Max salary (₹/yr)<input type="number" min="0" name="salaryMax" value={form.salaryMax} onChange={onChange} /></label>
          </div>
          {isEdit && (
            <label>Status<select name="status" value={form.status} onChange={onChange}><option>Open</option><option>Closed</option></select></label>
          )}
          <label>Description<textarea rows="6" name="description" value={form.description} onChange={onChange} required /></label>
          <div className="row">
            <button className="btn primary" disabled={saving}>{saving ? 'Saving...' : isEdit ? 'Update job' : 'Create job'}</button>
            <button type="button" className="btn" onClick={() => navigate('/recruiter/jobs')}>Cancel</button>
          </div>
        </form>
      </Async>
    </>
  );
}
