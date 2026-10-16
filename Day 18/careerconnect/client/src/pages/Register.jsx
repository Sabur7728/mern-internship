import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "", phone: "", location: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) return setError("Name, email and password are required");
    if (form.password.length < 8) return setError("Password must be at least 8 characters");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match");

    setSubmitting(true);
    try {
      const { confirmPassword, ...payload } = form; // role is never sent
      await register(payload);
      navigate("/login", { state: { message: "Registration successful. Please log in." } });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="card narrow">
      <h2>Candidate Registration</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password (min 8)" value={form.password} onChange={handleChange} />
        <input name="confirmPassword" type="password" placeholder="Confirm password" value={form.confirmPassword} onChange={handleChange} />
        <button disabled={submitting}>{submitting ? "Creating..." : "Register"}</button>
      </form>
      <p>
        Already registered? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}