import { useEffect, useState } from "react";
import { getApplications, updateApplicationStatus } from "../services/applicationService";

const STATUSES = ["Applied", "Shortlisted", "Interview", "Hired", "Rejected"];

export default function RecruiterApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getApplications();
        setApplications(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleStatus = async (id, status) => {
    setError("");
    try {
      const result = await updateApplicationStatus(id, status);
      setApplications((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: result.data.status } : a))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading applications...</p>;

  return (
    <div>
      <h2>Applications for your jobs</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr><th>Candidate</th><th>Email</th><th>Position</th><th>Applied</th><th>Status</th></tr>
          </thead>
          <tbody>
            {applications.map((a) => (
              <tr key={a._id}>
                <td>{a.candidateId?.name}</td>
                <td>{a.candidateId?.email}</td>
                <td>{a.jobId?.title}</td>
                <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                <td>
                  <select value={a.status || "Applied"} onChange={(e) => handleStatus(a._id, e.target.value)}>
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}