import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { applicationService } from "../../services/resources";
import Status from "../../components/Status";

const STATUSES = ["pending", "reviewed", "shortlisted", "rejected", "hired"];

export default function Applications() {
  const { data, error, loading, reload } = useFetch(applicationService.managed);
  const [actionError, setActionError] = useState("");

  const changeStatus = async (id, status) => {
    setActionError("");
    try {
      await applicationService.updateStatus(id, status);
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <div>
      <h2>Applications</h2>
      <Status loading={loading} error={error || actionError} />
      <table>
        <thead><tr><th>Candidate</th><th>Email</th><th>Job</th><th>Cover letter</th><th>Status</th></tr></thead>
        <tbody>
          {data?.applications.map((a) => (
            <tr key={a._id}>
              <td>{a.candidate?.name}</td>
              <td>{a.candidate?.email}</td>
              <td>{a.job?.title}</td>
              <td>{a.coverLetter || "-"}</td>
              <td>
                <select value={a.status} onChange={(e) => changeStatus(a._id, e.target.value)}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}