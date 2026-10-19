import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import useFetch from '../hooks/useFetch';
import { Alert, Field } from '../components/UI';
const blank = { firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', gender: 'Male', department: '', designation: '', joiningDate: '', employmentType: 'Full-time', salary: '', manager: '', address: '', city: '', state: '', postalCode: '', status: 'Active' };
export default function EmployeeForm() {
  const { id } = useParams(), nav = useNavigate();
  const [f, setF] = useState(blank), [v, setV] = useState({}), [err, setErr] = useState(''), [ok, setOk] = useState(''), [busy, setBusy] = useState(false);
  const depts = useFetch('/departments').data || [];
  useEffect(() => { if (id) api('/employees/' + id).then(e => setF({ ...blank, ...Object.fromEntries(Object.keys(blank).map(k => [k, e[k] ?? ''])), department: e.department?._id || '', dateOfBirth: (e.dateOfBirth || '').slice(0, 10), joiningDate: (e.joiningDate || '').slice(0, 10) })).catch(x => setErr(x.message)); }, [id]);
  const set = (k, val) => setF({ ...f, [k]: val });
  const validate = () => {
    const x = {};
    if (!f.firstName.trim()) x.firstName = 'Required'; if (!f.lastName.trim()) x.lastName = 'Required';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) x.email = 'Valid email required';
    if (f.phone && !/^\d{10}$/.test(f.phone)) x.phone = 'Must be 10 digits';
    if (!f.department) x.department = 'Required'; if (!f.designation.trim()) x.designation = 'Required'; if (!f.joiningDate) x.joiningDate = 'Required';
    if (f.salary !== '' && +f.salary < 0) x.salary = 'Cannot be negative';
    return x;
  };
  const submit = async e => {
    e.preventDefault(); setErr(''); const x = validate(); setV(x); if (Object.keys(x).length) return;
    setBusy(true);
    try { await api(id ? '/employees/' + id : '/employees', { method: id ? 'PATCH' : 'POST', body: f }); setOk(id ? 'Employee updated successfully' : 'Employee created successfully'); setTimeout(() => nav('/employees'), 800); }
    catch (e2) { setErr(e2.message); } setBusy(false);
  };
  const I = (k, label, type = 'text') => <Field label={label}><input type={type} value={f[k]} onChange={e => set(k, e.target.value)} />{v[k] && <small className="err">{v[k]}</small>}</Field>;
  const S = (k, label, opts) => <Field label={label}><select value={f[k]} onChange={e => set(k, e.target.value)}>{opts}</select>{v[k] && <small className="err">{v[k]}</small>}</Field>;
  return <><h1>{id ? 'Edit' : 'Add'} employee</h1><Alert type="error">{err}</Alert><Alert type="success">{ok}</Alert>
    <form className="card formgrid" onSubmit={submit} noValidate>
      {I('firstName', 'First name')}{I('lastName', 'Last name')}{I('email', 'Email', 'email')}{I('phone', 'Phone')}{I('dateOfBirth', 'Date of birth', 'date')}
      {S('gender', 'Gender', ['Male', 'Female', 'Other'].map(o => <option key={o}>{o}</option>))}
      {S('department', 'Department', [<option key="" value="">Select…</option>, ...depts.map(d => <option key={d._id} value={d._id}>{d.name}</option>)])}
      {I('designation', 'Designation')}{I('joiningDate', 'Joining date', 'date')}
      {S('employmentType', 'Employment type', ['Full-time', 'Part-time', 'Contract', 'Intern'].map(o => <option key={o}>{o}</option>))}
      {I('salary', 'Salary', 'number')}{I('manager', 'Manager')}{I('address', 'Address')}{I('city', 'City')}{I('state', 'State')}{I('postalCode', 'Postal code')}
      {id && S('status', 'Status', ['Active', 'On Leave', 'Inactive', 'Resigned'].map(o => <option key={o}>{o}</option>))}
      <div className="full"><button className="btn primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button> <button type="button" className="btn" onClick={() => nav('/employees')}>Cancel</button></div>
    </form></>;
}
