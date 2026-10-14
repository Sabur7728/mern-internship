import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getDashboardStats();
        setStats(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loading text="Loading dashboard..." />;
  if (error) return <ErrorMessage message={error} />;

  const cards = [
    ["Total Jobs", stats.totalJobs],
    ["Open Jobs", stats.openJobs],
    ["Candidates", stats.totalCandidates],
    ["Applications", stats.totalApplications],
    ["Interviews", stats.interviews],
    ["Hired", stats.hired],
  ];

  return (
    <div>
      <h2>Recruiter Dashboard</h2>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {cards.map(([label, value]) => (
          <div key={label} style={{ border: "1px solid #ddd", padding: "1rem", minWidth: 130 }}>
            <div style={{ fontSize: "1.75rem" }}>{value}</div>
            <div>{label}</div>
          </div>
        ))}
      </div>

      <h3>Recent applications</h3>
      {stats.recent.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Position</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stats.recent.map((a) => (
              <tr key={a._id}>
                <td>{a.candidateId?.name}</td>
                <td>{a.jobId?.title}</td>
                <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                <td>{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}