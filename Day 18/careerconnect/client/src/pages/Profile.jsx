import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../services/authService";

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    name: user.name || "", phone: user.phone || "", location: user.location || "",
  });
  const [msg, setMsg] = useState({ type: "", text: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(form);
      await refreshUser();
      setMsg({ type: "success", text: "Profile updated" });
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    }
  };

  return (
    <div className="card narrow">
      <h2>My Profile</h2>
      <p>Email: {user.email} ({user.role})</p>
      {msg.text && <p className={msg.type}>{msg.text}</p>}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
        <button>Save</button>
      </form>
    </div>
  );
}