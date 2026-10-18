export default function StatusBadge({ status }) {
  return <span className={`badge s-${String(status).toLowerCase().replace(/\s+/g, '-')}`}>{status}</span>;
}
