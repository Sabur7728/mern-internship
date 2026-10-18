import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { api } from '../../services/api';
import { Loading, ErrorMsg } from '../../components/Status';
export default function AdminCategories() {
  const { data, loading, error, reload } = useFetch('/categories');
  const [f, setF] = useState({ name: '', description: '', image: '' }); const [editId, setEditId] = useState(null); const [err, setErr] = useState('');
  const save = async (e) => { e.preventDefault(); setErr('');
    try { editId ? await api(`/categories/${editId}`, { method: 'PATCH', body: f }) : await api('/categories', { method: 'POST', body: f }); setF({ name: '', description: '', image: '' }); setEditId(null); reload(); } catch (e) { setErr(e.message); } };
  const del = async (c) => { if (confirm(`Delete ${c.name}?`)) try { await api(`/categories/${c._id}`, { method: 'DELETE' }); reload(); } catch (e) { alert(e.message); } };
  const toggle = async (c) => { await api(`/categories/${c._id}`, { method: 'PATCH', body: { isActive: !c.isActive } }); reload(); };
  return (
    <div><h1>Categories</h1>
      <form className="form wide" onSubmit={save}><input placeholder="Name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        <input placeholder="Description" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
        <input placeholder="Image URL" value={f.image} onChange={(e) => setF({ ...f, image: e.target.value })} />
        {err && <p className="bad">{err}</p>}<button className="btn">{editId ? 'Update category' : 'Add category'}</button></form>
      {loading ? <Loading /> : error ? <ErrorMsg message={error} retry={reload} /> :
        <div className="scroll"><table><thead><tr><th>Name</th><th>Description</th><th>Active</th><th></th></tr></thead>
          <tbody>{data.categories.map((c) => <tr key={c._id}><td>{c.name}</td><td>{c.description}</td><td><input type="checkbox" checked={c.isActive} onChange={() => toggle(c)} /></td>
            <td className="row"><button className="btn ghost" onClick={() => { setEditId(c._id); setF({ name: c.name, description: c.description || '', image: c.image || '' }); }}>Edit</button>
              <button className="btn ghost" onClick={() => del(c)}>Delete</button></td></tr>)}</tbody></table></div>}
    </div>
  );
}
