import { Link } from 'react-router-dom';
import { formatSalary } from '../utils/format.js';

export default function JobCard({ job }) {
  return (
    <Link to={`/jobs/${job._id}`} className="card job-card">
      <h3>{job.title}</h3>
      <p className="muted">{job.company?.name} • {job.location}</p>
      <div className="chips">
        <span className="chip">{job.employmentType}</span>
        <span className="chip">{job.experienceMin}+ yrs</span>
        <span className="chip">{formatSalary(job.salaryMin, job.salaryMax)}</span>
      </div>
      <div className="chips">{job.skills?.slice(0, 4).map((s) => <span key={s} className="chip skill">{s}</span>)}</div>
    </Link>
  );
}
