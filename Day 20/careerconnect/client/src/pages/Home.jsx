import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { jobApi } from '../services/api.js';
import JobCard from '../components/JobCard.jsx';
import { Async } from '../components/States.jsx';

export default function Home() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const latest = useFetch(() => jobApi.list({ limit: 6 }), []);

  const onSubmit = (e) => { e.preventDefault(); navigate(`/jobs?search=${encodeURIComponent(search)}`); };

  return (
    <>
      <section className="hero">
        <h1>Find your next career move</h1>
        <p>CareerConnect links candidates, recruiters and companies in one platform.</p>
        <form className="search-bar" onSubmit={onSubmit}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Job title, skill, company or location" />
          <button className="btn primary">Search</button>
        </form>
        <p><Link to="/register">Create an account</Link> to apply or to post jobs.</p>
      </section>
      <h2>Latest jobs</h2>
      <Async state={latest} isEmpty={!latest.data?.data?.length} emptyText="No jobs posted yet.">
        <div className="grid">{latest.data?.data.map((j) => <JobCard key={j._id} job={j} />)}</div>
      </Async>
    </>
  );
}
