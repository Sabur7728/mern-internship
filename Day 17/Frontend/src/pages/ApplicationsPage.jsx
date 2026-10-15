import { useEffect, useState } from "react";
import { getApplications, updateApplicationStatus } from "../services/candidateService";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";

const STATUSES = ["Applied", "Shortlisted", "Interview", "Hired", "Rejected"];

export default function ApplicationsPage() {
  const { user } = useAuth();
  const canUpdate = ["recruiter", "admin"].includes(user?.role);
  const isCandidate = user?.role === "candidate";

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getApplications();
        setApps(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleStatus = async (id, status) => {
    setUpdatingId(id);
    setError("");
    setSuccess("");
    try {
      const res = await updateApplicationStatus(id, status);
      // server-confirmed update
      setApps((prev) => prev.map((a) => (a._id === id ? { ...a, status: res.data.status } : a)));
      setSuccess("Status updated successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const columns = [
    ...(!isCandidate
      ? [
          { key: "candidate", label: "Candidate", render: (a) => a.candidate?.name || "-" },
          { key: "email", label: "Email", render: (a) => a.candidate?.email || "-" },
          { key: "exp", label: "Experience", render: (a) => `${a.candidate?.experience ?? 0} yrs` },
          { key: "skills", label: "Skills", render: (a) => (a.candidate?.skills || []).join(", ") },
        ]
      : []),
    { key: "job", label: "Job", render: (a) => a.job?.title || "-" },
    { key: "createdAt", label: "Applied", render: (a) => new Date(a.createdAt).toLocaleDateString() },
    {
      key: "status",
      label: "Status",
      render: (a) =>
        canUpdate ? (
          <select
            value={a.status}
            disabled={updatingId === a._id}
            onChange={(e) => handleStatus(a._id, e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        ) : (
          <StatusBadge value={a.status} />
        ),
    },
  ];

  return (
    <div>
      <h2>{isCandidate ? "My Applications" : "Applications"}</h2>
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <DataTable
        columns={columns}
        data={apps}
        loading={loading}
        emptyMessage={
          isCandidate
            ? "Aapne abhi tak kisi job par apply nahi kiya."
            : "No applications have been submitted yet."
        }
      />
    </div>
  );
}