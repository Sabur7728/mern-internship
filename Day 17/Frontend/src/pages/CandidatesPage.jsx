import { useState } from "react";
import { Link } from "react-router-dom";
import useList from "../hooks/useList";
import { getCandidates, deleteCandidate, updateCandidate } from "../services/candidateService";
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";
import ConfirmDialog from "../components/ConfirmDialog";
import CandidateForm, { CANDIDATE_STATUSES } from "../components/CandidateForm";
import { useAuth } from "../context/AuthContext";

export default function CandidatesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const { items, filters, updateFilter, page, setPage, pagination, loading, error, setError, reload } =
    useList(getCandidates, { search: "", status: "", location: "", minExperience: "", maxExperience: "", sort: "createdAt", order: "desc" });

  const [formState, setFormState] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [success, setSuccess] = useState("");

  const canDelete = (c) => isAdmin || c.createdBy === user.id;

  const handleSaved = () => {
    setSuccess(formState.mode === "edit" ? "Candidate updated successfully" : "Candidate created successfully");
    setFormState(null);
    reload();
  };

  const handleStatus = async (id, status) => {
    setUpdatingId(id);
    setError("");
    try {
      await updateCandidate(id, { status });
      setSuccess("Status updated");
      reload(); // server-confirmed
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const confirmDelete = async () => {
    const id = toDelete._id;
    setDeletingId(id);
    try {
      await deleteCandidate(id);
      setToDelete(null);
      setSuccess("Candidate deleted");
      reload();
    } catch (err) {
      setError(err.message);
      setToDelete(null);
    } finally {
      setDeletingId(null);
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "location", label: "Location", render: (c) => c.location || "-" },
    { key: "experience", label: "Experience", render: (c) => `${c.experience} yrs` },
    { key: "currentPosition", label: "Position", render: (c) => c.currentPosition || "-" },
    { key: "skills", label: "Skills", render: (c) => c.skills.join(", ") },
    {
      key: "status", label: "Status",
      render: (c) => (
        <select value={c.status} disabled={updatingId === c._id} onChange={(e) => handleStatus(c._id, e.target.value)}>
          {CANDIDATE_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      ),
    },
    { key: "createdAt", label: "Applied", render: (c) => new Date(c.createdAt).toLocaleDateString() },
  ];

  const actions = (c) => (
    <>
      <Link to={`/candidates/${c._id}`}>View</Link>
      <button onClick={() => setFormState({ mode: "edit", job: c })}>Edit</button>
      {canDelete(c) && (
        <button onClick={() => setToDelete(c)} disabled={deletingId === c._id}>
          {deletingId === c._id ? "Deleting..." : "Delete"}
        </button>
      )}
    </>
  );

  return (
    <div>
      <h2>Candidates</h2>
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input placeholder="Search name, email, skill..." value={filters.search} onChange={(e) => updateFilter("search", e.target.value)} />
        <select value={filters.status} onChange={(e) => updateFilter("status", e.target.value)}>
          <option value="">All statuses</option>
          {CANDIDATE_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <input placeholder="Location" value={filters.location} onChange={(e) => updateFilter("location", e.target.value)} />
        <input type="number" min="0" placeholder="Min exp" style={{ width: 100 }} value={filters.minExperience} onChange={(e) => updateFilter("minExperience", e.target.value)} />
        <input type="number" min="0" placeholder="Max exp" style={{ width: 100 }} value={filters.maxExperience} onChange={(e) => updateFilter("maxExperience", e.target.value)} />
        <select
          value={`${filters.sort}:${filters.order}`}
          onChange={(e) => { const [s, o] = e.target.value.split(":"); updateFilter("sort", s); updateFilter("order", o); }}
        >
          <option value="createdAt:desc">Newest</option>
          <option value="name:asc">Name A-Z</option>
          <option value="experience:desc">Experience (high)</option>
        </select>
        <button onClick={() => setFormState({ mode: "create" })}>+ Add Candidate</button>
      </div>

      {formState && (
        <CandidateForm
          mode={formState.mode}
          initialData={formState.job}
          onSuccess={handleSaved}
          onCancel={() => setFormState(null)}
        />
      )}

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        actions={actions}
        emptyMessage={filters.search ? "No candidates match your search." : "No candidates found."}
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