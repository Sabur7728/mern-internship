import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { dashboardPath } from '../utils/constants.js';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'candidate' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.name.trim().length < 2) return setError('Name must be at least 2 characters');
    if (form.password.length < 8) return setError('Password must be at least 8 characters');
    setSubmitting(true);
    try {
      const user = await register(form);
      navigate(dashboardPath(user.role), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card form narrow" onSubmit={onSubmit}>
      <h2>Create account</h2>
      {error && <div className="alert error">{error}</div>}
      <label>Full name<input name="name" value={form.name} onChange={onChange} required /></label>
      <label>Email<input type="email" name="email" value={form.email} onChange={onChange} required /></label>
      <label>Password (min 8 chars)<input type="password" name="password" value={form.password} onChange={onChange} required minLength={8} /></label>
      <label>I am a
        <select name="role" value={form.role} onChange={onChange}>
          <option value="candidate">Candidate (looking for jobs)</option>
          <option value="recruiter">Recruiter (hiring)</option>
        </select>
      </label>
      <button className="btn primary" disabled={submitting}>{submitting ? 'Creating...' : 'Register'}</button>
      <p className="muted">Already registered? <Link to="/login">Login</Link></p>
    </form>
  );
}
