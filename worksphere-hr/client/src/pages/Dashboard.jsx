import { useAuth } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import { State } from '../components/UI';
function Bars({ title, data }) {
  const max = Math.max(1, ...data.map(d => d.value));
  return <div className="card"><h3>{title}</h3>{data.length === 0 ? <p className="muted">No data yet.</p> : data.map(d => <div className="bar" key={d.label}><span>{d.label}</span><div><i style={{ width: (d.value / max * 100) + '%' }} /></div><b>{d.value}</b></div>)}</div>;
}
export default function Dashboard() {
  const { user } = useAuth();
  const { data, loading, error } = useFetch('/dashboard/' + user.role);
  return <><h1>Dashboard</h1><State loading={loading} error={error}>{data && <>
    {data.profile && <div className="card"><h3>{data.profile.name}</h3>{Object.entries(data.profile).filter(([k]) => k !== 'name').map(([k, v]) => <span className="chip" key={k}><b>{k}:</b> {v}</span>)}</div>}
    <div className="grid">{data.cards.map(c => <div className="stat" key={c.label}><small>{c.label}</small><strong>{c.value}</strong></div>)}</div>
    {data.charts && <div className="grid2">{data.charts.map(c => <Bars key={c.title} {...c} />)}</div>}
    {data.recent && <div className="card"><h3>{data.recent.title}</h3><div className="scroll"><table><thead><tr>{data.recent.headers.map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{data.recent.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody></table></div></div>}
  </>}</State></>;
}
