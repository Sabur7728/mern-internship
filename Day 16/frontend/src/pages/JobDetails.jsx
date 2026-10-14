import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getJobById } from "../services/jobService";
import { createApplication } from "../services/applicationService";
import { useAuth } from "../context/AuthContext";

export default function JobDetails() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ coverLetter: "", resumeUrl: "" });
  const [submitting, setSubmitting] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getJobById(id);
        setJob(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplyError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await createApplication({ jobId: id, ...form });
      setSuccess("Application submitted successfully!");
      setForm({ coverLetter: "", resumeUrl: "" });
    } catch (err) {
      setApplyError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading job...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!job) return <p>Job not found.</p>;

  return (
    <div>
      <h2>{job.title}</h2>
      <p>{job.company} • {job.location} • {job.employmentType}</p>
      <p>{job.description}</p>

      <hr />

      {!isAuthenticated && <p><Link to="/login">Login</Link> as candidate to apply.</p>}

      {isAuthenticated && user.role === "candidate" && (
        <form onSubmit={handleApply} style={{ display: "grid", gap: "0.75rem", maxWidth: 480 }}>
          <h3>Apply for this job</h3>
          <textarea name="coverLetter" placeholder="Cover letter" value={form.coverLetter} onChange={handleChange} />
          <input name="resumeUrl" placeholder="Resume URL" value={form.resumeUrl} onChange={handleChange} />
          {applyError && <p style={{ color: "red" }}>{applyError}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Apply Now"}
          </button>
        </form>
      )}
    </div>
  );
}