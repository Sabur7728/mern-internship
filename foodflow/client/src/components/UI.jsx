import { STEPS } from '../utils/format.js';
export function Async({ q, empty, emptyText = 'Nothing found.', children }) {
  if (q.loading) return <div className="state"><div className="spin" />Loading...</div>;
  if (q.error) return <div className="state error"><p>{q.error}</p><button className="btn sm" onClick={q.reload}>Try again</button></div>;
  if (empty && empty(q.data)) return <div className="state">{emptyText}</div>;
  return children(q.data);
}
export function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;
  return (
    <div className="pager">
      <button className="btn sm ghost" disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</button>
      <span>Page {page} of {totalPages}</span>
      <button className="btn sm ghost" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next</button>
    </div>
  );
}
export const StatusBadge = ({ status }) => <span className={'badge s-' + String(status).toLowerCase().replace(/\s+/g, '-')}>{status}</span>;
export const Stat = ({ label, value, tone }) => <div className={'stat ' + (tone || '')}><b>{value}</b><span>{label}</span></div>;
export function OrderProgress({ status }) {
  if (status === 'Cancelled') return <div className="alert error">This order was cancelled.</div>;
  const idx = STEPS.indexOf(status);
  return (
    <ol className="progress">
      {STEPS.map((s, i) => (
        <li key={s} className={i < idx ? 'done' : i === idx ? 'now' : ''}><i>{i < idx ? '✓' : i === idx ? '●' : '○'}</i>{s}</li>
      ))}
    </ol>
  );
}
