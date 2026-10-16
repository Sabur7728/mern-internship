import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useFetch from "../../hooks/useFetch";
import { jobService } from "../../services/resources";
import Status from "../../components/Status";

export default function ManageJobs() {
  const { user } = useAuth();
  const base = user.role === "admin" ? "/admin" : "/recruiter";
  const { data, error, loading, reload } = useFetch(jobService.managed);
  const [actionError, setActionError] = useState("");

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job and its applications?")) return;
    setActionError("");
    try {
      await jobService.remove(id);
      reload();
    } catch (err) {
      setActionError(err.message); // e.g. 403 ownership error
    }
  };

  return (
    <div>
      <h2>{user.role === "admin" ? "All Jobs" : "My Jobs"}</h2>
      <Link to={`${base}/jobs/new`}><button>+ Create Job</button></Link>
      <Status loading={loading} error={error || actionError} />
      <table>
        <thead><tr><th>Title</th><th>Company</th><th>Posted by</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {data?.jobs.map((j) => (
            <tr key={j._id}>
              <td>{j.title}</td>
              <td>{j.company?.name}</td>
              <td>{j.postedBy?.name}</td>
              <td><span className="badge">{j.status}</span></td>
              <td>
                <Link to={`${base}/jobs/${j._id}/edit`}>Edit</Link>{" "}
                <button onClick={() => handleDelete(j._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}