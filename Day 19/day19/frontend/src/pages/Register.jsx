import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "candidate" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!form.name || !form.email || form.password.length < 8) {
      return setError("Name, valid email and a password of at least 8 characters are required");
    }
    setSubmitting(true);
    setError("");
    try {
      await register(form);
      navigate("/jobs");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to register. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <h1>Register</h1>
      <form onSubmit={onSubmit} noValidate>
        <label htmlFor="name">Name</label>
        <input id="name" value={form.name} onChange={set("name")} />
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={form.email} onChange={set("email")} />
        <label htmlFor="password">Password (min 8)</label>
        <input id="password" type="password" value={form.password} onChange={set("password")} />
        <label htmlFor="role">I am a</label>
        <select id="role" value={form.role} onChange={set("role")}>
          <option value="candidate">Candidate</option>
          <option value="recruiter">Recruiter</option>
        </select>
        {error && <p role="alert">{error}</p>}
        <p><button type="submit" disabled={submitting}>{submitting ? "Creating..." : "Register"}</button></p>
      </form>
    </main>
  );
}
