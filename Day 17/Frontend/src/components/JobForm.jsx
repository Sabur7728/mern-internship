import { useEffect, useState } from "react";
import { createJob, updateJob } from "../services/jobService";
import { getCompanies } from "../services/companyService";

const empty = {
  title: "",
  company: "",
  location: "",
  employmentType: "Full-time",
  experienceMin: 0,
  experienceMax: 0,
  salaryMin: "",
  salaryMax: "",
  skills: "",
  status: "Open",
};

const validate = (d) => {
  const e = {};
  if (!d.title.trim()) e.title = "Job title is required";
  if (!d.location.trim()) e.location = "Location is required";
  if (Number(d.experienceMin) < 0) e.experienceMin = "Cannot be negative";
  if (Number(d.experienceMax) < Number(d.experienceMin))
    e.experienceMax = "Max cannot be less than min";
  if (d.salaryMin !== "" && Number(d.salaryMin) < 0) e.salaryMin = "Cannot be negative";
  if (d.salaryMax !== "" && Number(d.salaryMax) < Number(d.salaryMin || 0))
    e.salaryMax = "Max cannot be less than min";
  if (!d.skills.trim()) e.skills = "Enter at least one skill";
  return e;
};

export default function JobForm({ mode = "create", initialData, onSuccess, onCancel }) {
  const [formData, setFormData] = useState(empty);
  const [companies, setCompanies] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getCompanies("?limit=100&sort=name&order=asc")
      .then((res) => setCompanies(res.data))
      .catch(() => setCompanies([]));
  }, []);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        ...empty,
        title: initialData.title || "",
        company: initialData.company?._id || initialData.company || "",
        location: initialData.location || "",
        employmentType: initialData.employmentType || "Full-time",
        experienceMin: initialData.experienceMin ?? 0,
        experienceMax: initialData.experienceMax ?? 0,
        salaryMin: initialData.salaryMin ?? "",
        salaryMax: initialData.salaryMax ?? "",
        skills: (initialData.skills || []).join(", "),
        status: initialData.status || "Open",
      });
    }
  }, [mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const v = validate(formData);
    setErrors(v);
    if (Object.keys(v).length) return;

    setSubmitting(true);
    setError("");
    try {
      const payload = {
        ...formData,
        company: formData.company || undefined,
        experienceMin: Number(formData.experienceMin),
        experienceMax: Number(formData.experienceMax),
        salaryMin: formData.salaryMin === "" ? undefined : Number(formData.salaryMin),
        salaryMax: formData.salaryMax === "" ? undefined : Number(formData.salaryMax),
      };

      const res =
        mode === "edit"
          ? await updateJob(initialData._id, payload)
          : await createJob(payload);

      onSuccess(res.data);
      if (mode === "create") setFormData(empty);
    } catch (err) {
      setError(err.message);
      if (err.fieldErrors) setErrors(err.fieldErrors);
    } finally {
      setSubmitting(false);
    }
  };

  const field = (name, label, type = "text") => (
    <label style={{ display: "block", marginBottom: 12 }}>
      {label}
      <input type={type} name={name} value={formData[name]} onChange={handleChange} />
      {errors[name] && <small style={{ color: "red" }}>{errors[name]}</small>}
    </label>
  );

  return (
    <form onSubmit={handleSubmit}>
      <h3>{mode === "edit" ? "Edit Job" : "Create Job"}</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "0 16px",
        }}
      >
        {field("title", "Title *")}

        <label style={{ display: "block", marginBottom: 12 }}>
          Company
          <select name="company" value={formData.company} onChange={handleChange}>
            <option value="">-- Select company --</option>
            {companies.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        {field("location", "Location *")}

        <label style={{ display: "block", marginBottom: 12 }}>
          Employment Type
          <select name="employmentType" value={formData.employmentType} onChange={handleChange}>
            {["Full-time", "Part-time", "Contract", "Internship"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>

        {field("experienceMin", "Min Experience (yrs)", "number")}
        {field("experienceMax", "Max Experience (yrs)", "number")}
        {field("salaryMin", "Min Salary", "number")}
        {field("salaryMax", "Max Salary", "number")}
        {field("skills", "Skills (comma separated) *")}

        <label style={{ display: "block", marginBottom: 12 }}>
          Status
          <select name="status" value={formData.status} onChange={handleChange}>
            {["Open", "Closed", "Draft"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <button type="submit" disabled={submitting}>
          {submitting
            ? mode === "edit"
              ? "Saving changes..."
              : "Creating job..."
            : mode === "edit"
            ? "Save Changes"
            : "Create Job"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}