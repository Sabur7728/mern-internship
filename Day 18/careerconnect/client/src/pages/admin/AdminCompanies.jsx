import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { companyService } from "../../services/resources";
import Status from "../../components/Status";

export default function AdminCompanies() {
  const { data, error, loading, reload } = useFetch(companyService.list);
  const [actionError, setActionError] = useState("");
  const [form, setForm] = useState({ name: "", location: "", website: "", description: "" });

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
      await companyService.create(form);
      setForm({ name: "", location: "", website: "", description: "" });
    });
  };

  const handleRename = (c) => {
    const name = window.prompt("New company name", c.name);
    if (name && name !== c.name) run(() => companyService.update(c._id, { name }));
  };

  return (
    <div>
      <h2>Company Management</h2>
      <Status loading={loading} error={error || actionError} />

      <form onSubmit={handleCreate} className="inline-form">
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <input placeholder="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
        <button>Add company</button>
      </form>

      <table>
        <thead><tr><th>Name</th><th>Location</th><th>Website</th><th></th></tr></thead>
        <tbody>
          {data?.companies.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td><td>{c.location}</td><td>{c.website}</td>
              <td>
                <button onClick={() => handleRename(c)}>Rename</button>{" "}
                <button onClick={() => window.confirm("Delete company?") && run(() => companyService.remove(c._id))}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}