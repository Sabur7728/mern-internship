import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!form.email || !form.password) return setError("Email and password are required");
    setSubmitting(true);
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/jobs");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to log in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <h1>Login</h1>
      <form onSubmit={onSubmit} noValidate>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p role="alert">{error}</p>}
        <p><button type="submit" disabled={submitting}>{submitting ? "Logging in..." : "Login"}</button></p>
      </form>
      <p>No account? <Link to="/register">Register</Link></p>
    </main>
  );
}
