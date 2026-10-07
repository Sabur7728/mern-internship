import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddCandidate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    location: "",
    status: "Applied",
    skills: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Har input change par state update
  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  // Submit handler: yahi wo code hai jo aap puch rahe the
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("http://localhost:5000/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          experience: Number(formData.experience),
          // "React, Node.js" string ko array mein convert karna zaroori hai
          skills: formData.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      navigate("/candidates"); // success ke baad list page par
    } catch (err) {
      setError(err.message || "Candidate add nahi ho paya");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1>Add Candidate</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
        <input name="position" placeholder="Position" value={formData.position} onChange={handleChange} />
        <input name="experience" type="number" placeholder="Experience (years)" value={formData.experience} onChange={handleChange} />
        <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} />

        <select name="status" value={formData.status} onChange={handleChange}>
          <option>Applied</option>
          <option>Interview</option>
          <option>Hired</option>
          <option>Rejected</option>
        </select>

        <input name="skills" placeholder="Skills (comma separated: React, Node.js)" value={formData.skills} onChange={handleChange} />

        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Add Candidate"}
        </button>
      </form>
    </div>
  );
}