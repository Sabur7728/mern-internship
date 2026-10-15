import { useState } from "react";
import { Link } from "react-router-dom";
import useList from "../hooks/useList";
import { getCompanies, deleteCompany } from "../services/companyService";
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";
import ConfirmDialog from "../components/ConfirmDialog";
import CompanyForm from "../components/CompanyForm";
import { useAuth } from "../context/AuthContext";

export default function CompaniesPage() {
  const { user } = useAuth();
  const canManage = user?.role === "admin";

  const { items, filters, updateFilter, page, setPage, pagination, loading, error, setError, reload } =
    useList(getCompanies, { search: "", industry: "", sort: "createdAt", order: "desc" });

  const [formState, setFormState] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [success, setSuccess] = useState("");

  const handleSaved = () => {
    setSuccess(formState.mode === "edit" ? "Company updated successfully" : "Company created successfully");
    setFormState(null);
    reload();
  };

  const confirmDelete = async () => {
    const id = toDelete._id;
    setDeletingId(id);
    try {
      await deleteCompany(id);
      setToDelete(null);
      setSuccess("Company deleted");
      reload();
    } catch (err) {
      setError(err.message);
      setToDelete(null);
    } finally {
      setDeletingId(null);
    }
  };

  const columns = [
    { key: "name", label: "Company" },
    { key: "industry", label: "Industry", render: (c) => c.industry || "-" },
    { key: "location", label: "Location", render: (c) => c.location || "-" },
    { key: "size", label: "Size", render: (c) => c.size || "-" },
    { key: "website", label: "Website", render: (c) => c.website ? <a href={c.website} target="_blank" rel="noreferrer">{c.website}</a> : "-" },
    { key: "isActive", label: "Status", render: (c) => <span className={`badge ${c.isActive ? "badge-open" : "badge-closed"}`}>{c.isActive ? "Active" : "Inactive"}</span> },
  ];

  const actions = (c) => (
    <>
      <Link to={`/companies/${c._id}`}>View</Link>
      {canManage && (
        <>
          <button onClick={() => setFormState({ mode: "edit", company: c })}>Edit</button>
          <button onClick={() => setToDelete(c)} disabled={deletingId === c._id}>
            {deletingId === c._id ? "Deleting..." : "Delete"}
          </button>
        </>
      )}
    </>
  );

  return (
    <div>
      <h2>Companies</h2>
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input placeholder="Search companies..." value={filters.search} onChange={(e) => updateFilter("search", e.target.value)} />
        <input placeholder="Industry" value={filters.industry} onChange={(e) => updateFilter("industry", e.target.value)} />
        <select
          value={`${filters.sort}:${filters.order}`}
          onChange={(e) => { const [s, o] = e.target.value.split(":"); updateFilter("sort", s); updateFilter("order", o); }}
        >
          <option value="createdAt:desc">Newest</option>
          <option value="name:asc">Name A-Z</option>
        </select>
        {canManage && <button onClick={() => setFormState({ mode: "create" })}>+ Add Company</button>}
      </div>

      {formState && (
        <CompanyForm
          mode={formState.mode}
          initialData={formState.company}
          onSuccess={handleSaved}
          onCancel={() => setFormState(null)}
        />
      )}

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        actions={actions}
        emptyMessage={filters.search ? "No companies match your search." : "No companies yet."}
      />
      <Pagination page={page} pages={pagination.pages} onChange={setPage} />

      <ConfirmDialog
        open={!!toDelete}
        title={`Delete "${toDelete?.name}"?`}
        message="This action cannot be undone."
        loading={!!deletingId}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}