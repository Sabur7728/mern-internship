import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { userService } from "../../services/resources";
import { useAuth } from "../../context/AuthContext";
import Status from "../../components/Status";

export default function AdminUsers() {
  const { user: me } = useAuth();
  const { data, error, loading, reload } = useFetch(userService.list);
  const [actionError, setActionError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "recruiter" });

  const run = async (fn) => {
    setActionError("");
    try {
      await fn();
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    run(async () => {
      await userService.create(form);
      setForm({ name: "", email: "", password: "", role: "recruiter" });
    });
  };

  return (
    <div>
      <h2>User Management</h2>
      <Status loading={loading} error={error || actionError} />

      <form onSubmit={handleCreate} className="inline-form">
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="recruiter">recruiter</option>
          <option value="admin">admin</option>
          <option value="candidate">candidate</option>
        </select>
        <button>Create user</button>
      </form>

      <table>
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Active</th><th></th></tr></thead>
        <tbody>
          {data?.users.map((u) => {
            const isMe = u._id === me.id;
            return (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <select
                    value={u.role}
                    disabled={isMe}
                    onChange={(e) => run(() => userService.update(u._id, { role: e.target.value }))}
                  >
                    <option>candidate</option><option>recruiter</option><option>admin</option>
                  </select>
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={u.isActive}
                    disabled={isMe}
                    onChange={(e) => run(() => userService.update(u._id, { isActive: e.target.checked }))}
                  />
                </td>
                <td>
                  {!isMe && (
                    <button onClick={() => window.confirm("Delete user?") && run(() => userService.remove(u._id))}>
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}