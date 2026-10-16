import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { roleHome } from "../utils/roles";

export default function Login() {
  const { user, login } = useAuth();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Already logged in (or just logged in) -> go to role dashboard
  if (user) return <Navigate to={roleHome[user.role]} replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) return setError("Email and password are required");

    setSubmitting(true);
    try {
      await login(form); // state updates -> redirect above
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="card narrow">
      <h2>Login</h2>
      {location.state?.message && <p className="success">{location.state.message}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <button disabled={submitting}>{submitting ? "Logging in..." : "Login"}</button>
      </form>
      <p>
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}