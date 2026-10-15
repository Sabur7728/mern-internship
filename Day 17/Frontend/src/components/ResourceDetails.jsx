import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function ResourceDetails({ fetcher, backTo, name, rows }) {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetcher(id);
        setItem(res.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]); // eslint-disable-line

  if (loading) return <p>Loading {name}...</p>;
  if (error?.status === 404) return <p>This {name} no longer exists. <Link to={backTo}>Go back</Link></p>;
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;

  return (
    <div className="detail-card">
      <h2>{item.name || item.title}</h2>
      {rows(item).map(([label, value]) => (
        <div className="detail-row" key={label}>
          <span>{label}</span>
          <strong>{value || "-"}</strong>
        </div>
      ))}
      <p><Link to={backTo}>← Back</Link></p>
    </div>
  );
}