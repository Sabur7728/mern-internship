import StatusBadge from "../components/StatusBadge";

import { useState } from "react";
import { Link } from "react-router-dom";
import useList from "../hooks/useList";
import { getJobs, deleteJob } from "../services/jobService";
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";
import ConfirmDialog from "../components/ConfirmDialog";
import JobForm from "../components/JobForm";
import { useAuth } from "../context/AuthContext"; // from Day 16

export default function JobsPage() {
  const { user } = useAuth();
  const canManage = ["recruiter", "admin"].includes(user?.role);

  const {
    items, filters, updateFilter, page, setPage, pagination,
    loading, error, setError, reload,
  } = useList(getJobs, { search: "", status: "", sort: "createdAt", order: "desc" });

  const [formState, setFormState] = useState(null);     // null | { mode, job }
  const [toDelete, setToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [success, setSuccess] = useState("");

  const handleSaved = () => {
    setSuccess(formState.mode === "edit" ? "Job updated successfully" : "Job created successfully");
    setFormState(null);
    reload(); // refetch -> server-confirmed list
  };

  const confirmDelete = async () => {
    const id = toDelete._id;
    setDeletingId(id);
    try {
      await deleteJob(id);
      setToDelete(null);
      setSuccess("Job deleted");
      reload();
    } catch (err) {
      setError(err.message);
      setToDelete(null);
    } finally {
      setDeletingId(null);
    }
  };

//  const { items, filters, updateFilter, ... } = useList(getCandidates, {
//   search: "", status: "", location: "", minExperience: "", maxExperience: "",
// });

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "location", label: "Location" },
  { key: "experience", label: "Experience", render: (c) => `${c.experience} yrs` },
  { key: "currentPosition", label: "Position" },
  { key: "skills", label: "Skills", render: (c) => c.skills.join(", ") },
  { key: "status", label: "Status" },
  { key: "createdAt", label: "Applied", render: (c) => new Date(c.createdAt).toLocaleDateString() },
];

  const actions = (job) => (
    <>
      <Link to={`/jobs/${job._id}`}>View</Link>{" "}
      {canManage && (
        <>
          <button onClick={() => setFormState({ mode: "edit", job })}>Edit</button>{" "}
          <button onClick={() => setToDelete(job)} disabled={deletingId === job._id}>
            {deletingId === job._id ? "Deleting..." : "Delete"}
          </button>
        </>
      )}
    </>
  );

  return (
    <div>
      <h2>Jobs</h2>
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Search jobs..."
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
        />
        <select value={filters.status} onChange={(e) => updateFilter("status", e.target.value)}>
          <option value="">All statuses</option>
          <option>Open</option><option>Closed</option><option>Draft</option>
        </select>
        <select
          value={`${filters.sort}:${filters.order}`}
          onChange={(e) => {
            const [s, o] = e.target.value.split(":");
            updateFilter("sort", s); updateFilter("order", o);
          }}
        >
          <option value="createdAt:desc">Newest</option>
          <option value="createdAt:asc">Oldest</option>
          <option value="title:asc">Title A-Z</option>
        </select>
        {canManage && <button onClick={() => setFormState({ mode: "create" })}>+ Create Job</button>}
      </div>

      {formState && (
        <JobForm
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
        emptyMessage={filters.search ? "No jobs match your search." : "No jobs yet."}
      />
      <Pagination page={page} pages={pagination.pages} onChange={setPage} />

      <ConfirmDialog
        open={!!toDelete}
        title={`Delete "${toDelete?.title}"?`}
        message="This action cannot be undone."
        loading={!!deletingId}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}  // cancel = no API call
      />
    </div>
  );
}