export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  return (
    <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
      <button disabled={page === 1} onClick={() => onChange(page - 1)}>Previous</button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <button key={n} disabled={n === page} onClick={() => onChange(n)}>{n}</button>
      ))}
      <button disabled={page === pages} onClick={() => onChange(page + 1)}>Next</button>
    </div>
  );
}