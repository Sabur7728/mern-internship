import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getJobById } from "../services/jobService";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getJobById(id);
        setJob(res.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p>Loading job...</p>;
  if (error?.status === 404) return <p>This job no longer exists. <Link to="/jobs">Back to jobs</Link></p>;
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;

  return (
    <div>
      <h2>{job.title}</h2>
      <p>{job.company?.name} · {job.location} · {job.employmentType}</p>
      <p>Experience: {job.experienceMin}-{job.experienceMax} yrs</p>
      <p>Salary: {job.salaryMin ?? "-"} - {job.salaryMax ?? "-"}</p>
      <p>Skills: {job.skills.join(", ")}</p>
      <p>Status: {job.status}</p>
      <Link to="/jobs">Back</Link>
    </div>
  );
}