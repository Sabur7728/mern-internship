import useFetch from "../../hooks/useFetch";
import { applicationService } from "../../services/resources";
import Status from "../../components/Status";

export default function Candidates() {
  const { data, error, loading } = useFetch(applicationService.managed);

  const unique = new Map();
  data?.applications.forEach((a) => {
    if (a.candidate) unique.set(a.candidate._id, a.candidate);
  });

  return (
    <div>
      <h2>Candidates</h2>
      <Status loading={loading} error={error} />
      <table>
        <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Location</th></tr></thead>
        <tbody>
          {[...unique.values()].map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td><td>{c.email}</td><td>{c.phone || "-"}</td><td>{c.location || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}