export default function DataTable({ columns, data, loading, emptyMessage = "No records found.", actions }) {
  if (loading) return <p>Loading...</p>;
  if (!data.length) return <p>{emptyMessage}</p>;

  return (
    <table width="100%" cellPadding={8} style={{ borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {columns.map((c) => <th key={c.key} align="left">{c.label}</th>)}
          {actions && <th align="left">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row._id} style={{ borderTop: "1px solid #ddd" }}>
            {columns.map((c) => (
              <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>
            ))}
            {actions && <td>{actions(row)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}