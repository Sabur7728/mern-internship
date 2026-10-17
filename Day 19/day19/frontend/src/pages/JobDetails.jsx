import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    api.get(`/jobs/${id}`, { signal: controller.signal })
      .then((res) => { setJob(res.data); setError(null); })
      .catch((err) => {
        if (err.code === "ERR_CANCELED") return;
        setError(err.response?.data?.message || "Unable to load job.");
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [id]);

  if (loading) return <main><p role="status">Loading job...</p></main>;
  if (error) return <main><p role="alert">{error}</p><Link to="/jobs">Back to jobs</Link></main>;

  return (
    <main>
      <h1>{job.title}</h1>
      <p>{job.company} · {job.location}</p>
      <p>Experience: {job.experience} yrs · Salary: ₹{Number(job.salary).toLocaleString("en-IN")}</p>
      <p>{job.description}</p>
      <p>Posted by: {job.postedBy?.name}</p>
      <Link to="/jobs">Back to jobs</Link>
    </main>
  );
}
