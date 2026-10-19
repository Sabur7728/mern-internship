export function State({ loading, error, empty, emptyText = 'Nothing found.', children }) {
  if (loading) return <p className="muted">Loading…</p>;
  if (error) return <div className="alert error">{error}</div>;
  if (empty) return <p className="muted">{emptyText}</p>;
  return children;
}
export const Alert = ({ type, children }) => children ? <div className={'alert ' + type}>{children}</div> : null;
export const Badge = ({ v }) => <span className={'badge ' + String(v).toLowerCase().replace(/\s+/g, '-')}>{v}</span>;
export function Pager({ data, onPage }) {
  if (!data || data.totalPages <= 1) return null;
  return <div className="pager"><button className="btn sm" disabled={data.page <= 1} onClick={() => onPage(data.page - 1)}>Prev</button><span>Page {data.page} of {data.totalPages} ({data.total} total)</span><button className="btn sm" disabled={data.page >= data.totalPages} onClick={() => onPage(data.page + 1)}>Next</button></div>;
}
export const Field = ({ label, children }) => <label className="field"><span>{label}</span>{children}</label>;
