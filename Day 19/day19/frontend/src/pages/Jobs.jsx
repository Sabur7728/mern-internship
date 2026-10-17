import { useState, useEffect } from "react";
import useJobs from "../hooks/useJobs";
import useDebounce from "../hooks/useDebounce";
import JobCard from "../components/JobCard";

export default function Jobs() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);
  const { jobs, pagination, loading, error, retry } = useJobs({ search: debouncedSearch, page });

  useEffect(() => setPage(1), [debouncedSearch]);

  return (
    <main>
      <h1>Jobs</h1>

      <label htmlFor="job-search">Search jobs</label>
      <input
        id="job-search"
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Title or company"
      />

      {loading && <p role="status">Loading jobs...</p>}

      {error && !loading && (
        <div role="alert">
          <p>{error}</p>
          <button onClick={retry}>Try again</button>
        </div>
      )}

      {!loading && !error && jobs.length === 0 && <p>No jobs found.</p>}

      {!loading && !error && jobs.length > 0 && (
        <>
          <p>{pagination.total} jobs found</p>
          <section className="job-grid">
            {jobs.map((job) => <JobCard key={job._id} job={job} />)}
          </section>

          <nav aria-label="Pagination">
            <button onClick={() => setPage((p) => p - 1)} disabled={page <= 1}>Previous</button>
            <span> Page {pagination.page} of {pagination.pages} </span>
            <button onClick={() => setPage((p) => p + 1)} disabled={page >= pagination.pages}>Next</button>
          </nav>
        </>
      )}
    </main>
  );
}
