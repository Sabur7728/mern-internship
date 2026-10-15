import ResourceForm from "./ResourceForm";
import { createCandidate, updateCandidate } from "../services/candidateService";

export const CANDIDATE_STATUSES = ["Applied", "Shortlisted", "Interview", "Hired", "Rejected"];

export default function CandidateForm({ canSetStatus = true, ...props }) {
  const fields = [
    { name: "name", label: "Name", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Phone" },
    { name: "location", label: "Location" },
    { name: "experience", label: "Experience (yrs)", type: "number", default: 0 },
    { name: "currentPosition", label: "Current Position" },
    { name: "skills", label: "Skills (comma separated)", type: "list", required: true },
    ...(canSetStatus
      ? [{ name: "status", label: "Status", type: "select", options: CANDIDATE_STATUSES, default: "Applied" }]
      : []),
  ];
  return <ResourceForm label="Candidate" fields={fields} createFn={createCandidate} updateFn={updateCandidate} {...props} />;
}