import ResourceDetails from "../components/ResourceDetails";
import StatusBadge from "../components/StatusBadge";
import { getCandidateById } from "../services/candidateService";

export default function CandidateDetails() {
  return (
    <ResourceDetails
      name="candidate"
      backTo="/candidates"
      fetcher={getCandidateById}
      rows={(c) => [
        ["Email", c.email],
        ["Phone", c.phone],
        ["Location", c.location],
        ["Experience", `${c.experience} yrs`],
        ["Current Position", c.currentPosition],
        ["Skills", c.skills.join(", ")],
        ["Status", <StatusBadge value={c.status} />],
        ["Created", new Date(c.createdAt).toLocaleString()],
        ["Last Updated", new Date(c.updatedAt).toLocaleString()],
      ]}
    />
  );
}