import useFetch from "../../hooks/useFetch";
import { applicationService } from "../../services/resources";
import Status from "../../components/Status";

export default function MyApplications() {
  const { data, error, loading } = useFetch(applicationService.mine);
  return (
    <div>
      <h2>My Applications</h2>
      <Status loading={loading} error={error} />
      {data?.applications.length === 0 && <p>You have not applied to any jobs yet.</p>}
      <table>
        <tbody>
          {data?.applications.map((a) => (
            <tr key={a._id}>
              <td>{a.job?.title || "(job removed)"}</td>
              <td>{a.job?.company?.name}</td>
              <td><span className="badge">{a.status}</span></td>
              <td>{new Date(a.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}