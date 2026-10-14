import { useEffect, useState } from "react";
import { getApplications } from "../services/applicationService";

export default function Applications() {
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

  if (loading) return <p>Loading applications...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (applications.length === 0) return <p>You haven't applied to any jobs yet.</p>;

  return (
    <div>
      <h2>My Applications</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr><th>Job</th><th>Company</th><th>Applied on</th><th>Status</th></tr>
        </thead>
        <tbody>
          {applications.map((a) => (
            <tr key={a._id}>
              <td>{a.jobId?.title}</td>
              <td>{a.jobId?.company}</td>
              <td>{new Date(a.createdAt).toLocaleDateString()}</td>
              <td>{a.status || "Applied"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}