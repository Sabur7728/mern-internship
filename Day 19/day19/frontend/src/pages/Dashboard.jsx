import { useEffect, useState, useCallback } from "react";
import api from "../services/api";

const empty = { title: "", company: "", location: "", description: "", salary: 0, experience: 0 };

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/jobs", { params: { limit: 50 } });
      setJobs(res.data.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load jobs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const body = { ...form, salary: Number(form.salary), experience: Number(form.experience) };
      if (editingId) await api.put(`/jobs/${editingId}`, body);
      else await api.post("/jobs", body);
      setForm(empty);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const edit = async (id) => {
    try {
      const { data } = await api.get(`/jobs/${id}`);
      setForm({
        title: data.title, company: data.company, location: data.location,
        description: data.description, salary: data.salary, experience: data.experience,
      });
      setEditingId(id);
    } catch (err) { setError(err.response?.data?.message || "Unable to load job"); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try { await api.delete(`/jobs/${id}`); await load(); }
    catch (err) { setError(err.response?.data?.message || "Unable to delete (you can only delete your own jobs)"); }
  };

  return (
    <main>
      <h1>Recruiter Dashboard</h1>
      <form onSubmit={onSubmit} noValidate>
        <h2>{editingId ? "Edit job" : "Create job"}</h2>
        <label htmlFor="title">Title</label><input id="title" value={form.title} onChange={set("title")} />
        <label htmlFor="company">Company</label><input id="company" value={form.company} onChange={set("company")} />
        <label htmlFor="location">Location</label><input id="location" value={form.location} onChange={set("location")} />
        <label htmlFor="description">Description</label><textarea id="description" value={form.description} onChange={set("description")} />
        <label htmlFor="salary">Salary</label><input id="salary" type="number" value={form.salary} onChange={set("salary")} />
        <label htmlFor="experience">Experience (0-30)</label><input id="experience" type="number" value={form.experience} onChange={set("experience")} />
        {error && <p role="alert">{error}</p>}
        <p>
          <button type="submit" disabled={submitting}>{submitting ? "Saving..." : editingId ? "Update job" : "Save job"}</button>{" "}
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(empty); }}>Cancel</button>}
        </p>
      </form>

      <h2>All jobs</h2>
      {loading && <p role="status">Loading...</p>}
      {!loading && jobs.length === 0 && <p>No jobs found.</p>}
      {jobs.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Title</th><th>Company</th><th>Location</th><th>Actions</th></tr></thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j._id}>
                  <td>{j.title}</td><td>{j.company}</td><td>{j.location}</td>
                  <td><button onClick={() => edit(j._id)}>Edit</button> <button onClick={() => remove(j._id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
