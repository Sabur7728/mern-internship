import { useState } from 'react';
import useFetch from '../../hooks/useFetch.js';
import { candidateApi } from '../../services/api.js';
import { Async } from '../../components/States.jsx';

export default function RecruiterCandidates() {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const state = useFetch(() => candidateApi.list({ search: query, limit: 50 }), [query]);
  const list = state.data?.data || [];

  return (
    <>
      <h1>Candidates who applied to my jobs</h1>
      <form className="search-bar" onSubmit={(e) => { e.preventDefault(); setQuery(search); }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, skill or location" />
        <button className="btn primary">Search</button>
      </form>
      <Async state={state} isEmpty={!list.length} emptyText="No candidates yet.">
        <div className="grid">{list.map((c) => (
          <div key={c._id} className="card">
            <h3>{c.name}</h3>
            <p className="muted">{c.email}{c.phone ? ` • ${c.phone}` : ''}</p>
            <p>{c.location || 'Location n/a'} • {c.experienceYears} yrs • {c.education || 'Education n/a'}</p>
            <div className="chips">{c.skills.map((s) => <span key={s} className="chip skill">{s}</span>)}</div>
            {c.summary && <p className="muted">{c.summary}</p>}
          </div>))}
        </div>
      </Async>
    </>
  );
}
