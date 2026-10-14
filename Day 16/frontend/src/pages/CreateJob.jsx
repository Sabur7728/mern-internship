import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../services/jobService";

const initial = {
  title: "",
  company: "",
  location: "",
  employmentType: "Full-time",
  description: "",
  skills: "",
};

export default function CreateJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.company || !form.location) {
      setError("Title, company and location are required.");
      return;
    }

    const payload = {
      ...form,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      // recruiterId yahan NAHI bhejna, backend token se leta hai
    };

    setSubmitting(true);
    try {
      const result = await createJob(payload);
      navigate(`/jobs/${result.data._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.75rem", maxWidth: 480 }}>
      <h2>Create Job</h2>
      <input name="title" placeholder="Job title" value={form.title} onChange={handleChange} />
      <input name="company" placeholder="Company" value={form.company} onChange={handleChange} />
      <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
      <select name="employmentType" value={form.employmentType} onChange={handleChange}>
        <option>Full-time</option>
        <option>Part-time</option>
        <option>Contract</option>
        <option>Internship</option>
      </select>
      <input name="skills" placeholder="Skills (comma separated)" value={form.skills} onChange={handleChange} />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit" disabled={submitting}>
        {submitting ? "Creating..." : "Create Job"}
      </button>
    </form>
  );
}