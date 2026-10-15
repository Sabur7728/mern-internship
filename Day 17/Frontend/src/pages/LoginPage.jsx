import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "recruiter" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      if (isRegister) await register(form);
      else await login(form.email, form.password);
      navigate("/jobs");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="auth-wrap">
    <form onSubmit={handleSubmit} className="auth-card">
      <h2>{isRegister ? "Create account" : "Welcome back"}</h2>
      <p className="sub">{isRegister ? "Join CareerConnect today" : "Login to manage your recruitment"}</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {isRegister && (
        <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} />
      )}
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
      {isRegister && (
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="recruiter">Recruiter</option>
          <option value="candidate">Candidate</option>
        </select>
      )}

      <button type="submit" disabled={loading}>
        {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
      </button>

      <div className="switch">
        <button type="button" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Already have an account? Login" : "New user? Register"}
        </button>
      </div>
    </form>
  </div>
);
}
