import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { jobApi } from '../services/api.js';
import JobCard from '../components/JobCard.jsx';
import Pagination from '../components/Pagination.jsx';
import { Async } from '../components/States.jsx';
import { EMPLOYMENT_TYPES } from '../utils/constants.js';

const EMPTY = { search: '', location: '', employmentType: '', experience: '', salaryMin: '', skills: '' };

export default function Jobs() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({ ...EMPTY, search: params.get('search') || '' }); // inputs
  const [query, setQuery] = useState(form); // applied filters
  const [page, setPage] = useState(1);

  const state = useFetch(() => jobApi.list({ ...query, page, limit: 9 }), [query, page]);
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const apply = (e) => { e.preventDefault(); setPage(1); setQuery(form); };
  const reset = () => { setForm(EMPTY); setQuery(EMPTY); setPage(1); };

  return (
    <>
      <h1>Browse jobs</h1>
      <form className="card filters" onSubmit={apply}>
        <input name="search" value={form.search} onChange={onChange} placeholder="Search title, skill, company..." />
        <input name="location" value={form.location} onChange={onChange} placeholder="Location" />
        <select name="employmentType" value={form.employmentType} onChange={onChange}>
          <option value="">Any type</option>
          {EMPLOYMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <input type="number" min="0" name="experience" value={form.experience} onChange={onChange} placeholder="My experience (yrs)" />
        <input type="number" min="0" name="salaryMin" value={form.salaryMin} onChange={onChange} placeholder="Min salary (₹/yr)" />
        <input name="skills" value={form.skills} onChange={onChange} placeholder="Skills (comma separated)" />
        <div className="row"><button className="btn primary">Apply filters</button><button type="button" className="btn" onClick={reset}>Reset</button></div>
      </form>
      <Async state={state} isEmpty={!state.data?.data?.length} emptyText="No jobs match your search.">
        <div className="grid">{state.data?.data.map((j) => <JobCard key={j._id} job={j} />)}</div>
        <Pagination pagination={state.data?.pagination} onChange={setPage} />
      </Async>
    </>
  );
}
