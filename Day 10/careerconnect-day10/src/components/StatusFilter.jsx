function StatusFilter({ status, setStatus }) {
  return (
    <select
      className="filter-select"
      value={status}
      onChange={(event) =>
        setStatus(event.target.value)
      }
    >
      <option value="All">All Status</option>
      <option value="Applied">Applied</option>
      <option value="Shortlisted">Shortlisted</option>
      <option value="Interview">Interview</option>
      <option value="Rejected">Rejected</option>
      <option value="Hired">Hired</option>
    </select>
  );
}

export default StatusFilter;