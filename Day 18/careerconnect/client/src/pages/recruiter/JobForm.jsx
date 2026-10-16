import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { jobService, companyService } from "../../services/resources";

const empty = { title: "", description: "", location: "", salary: "", type: "full-time", company: "", status: "open" };

export default function JobForm() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const base = user.role === "admin" ? "/admin" : "/recruiter";

  const [form, setForm] = useState(empty);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const c = await companyService.list();
        setCompanies(c.companies);
        if (id) {
          const { job } = await jobService.get(id);
          setForm({
            title: job.title, description: job.description, location: job.location || "",
            salary: job.salary ?? "", type: job.type, company: job.company?._id || "", status: job.status,
          });
        }
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title || !form.description) return setError("Title and description are required");
    setSaving(true);
    try {
      const payload = { ...form, salary: form.salary === "" ? undefined : Number(form.salary) };
      if (id) await jobService.update(id, payload);
      else await jobService.create(payload);
      navigate(`${base}/jobs`);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="card narrow">
      <h2>{id ? "Edit Job" : "Create Job"}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
        <input name="salary" type="number" placeholder="Salary" value={form.salary} onChange={handleChange} />
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
        </select>
        <select name="company" value={form.company} onChange={handleChange}>
          <option value="">-- No company --</option>
          {companies.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
        <button disabled={saving}>{saving ? "Saving..." : "Save"}</button>
      </form>
    </div>
  );
}