import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { jobService, applicationService } from "../../services/resources";
import Status from "../../components/Status";

export default function CandidateJobDetails() {
  const { id } = useParams();
  const fetcher = useCallback(() => jobService.get(id), [id]);
  const { data, error, loading } = useFetch(fetcher);
  const [coverLetter, setCoverLetter] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    setMsg({ type: "", text: "" });
    try {
      await applicationService.apply({ jobId: id, coverLetter });
      setApplied(true);
      setMsg({ type: "success", text: "Application submitted!" });
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    }
  };

  const job = data?.job;
  return (
    <div className="card">
      <Status loading={loading} error={error} />
      {job && (
        <>
          <h2>{job.title}</h2>
          <p>{job.company?.name} - {job.location} - {job.type}</p>
          {job.salary && <p>Salary: {job.salary}</p>}
          <p>{job.description}</p>
          <hr />
          {msg.text && <p className={msg.type}>{msg.text}</p>}
          {!applied && job.status === "open" && (
            <>
              <textarea placeholder="Cover letter (optional)" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} />
              <button onClick={handleApply}>Apply</button>
            </>
          )}
          {job.status !== "open" && <p>This job is closed.</p>}
          <p><Link to="/candidate/applications">My applications</Link></p>
        </>
      )}
    </div>
  );
}