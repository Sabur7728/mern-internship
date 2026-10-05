function App() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [lastUpdated, setLastUpdated] = useState(null);

  async function refreshCandidates() {
    try {
      setLoading(true);
      setError("");

      const data = await getCandidates();

      setCandidates(data);
      setLastUpdated(new Date());
    } catch (error) {
      setError("Unable to refresh candidates.");
    } finally {
      setLoading(false);
    }
  }

  // Initial load
  useEffect(() => {
    refreshCandidates();
  }, []);

  // Automatic refresh
  useEffect(() => {
    const interval = setInterval(() => {
      refreshCandidates();
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Filter
  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      candidate.position
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      status === "All" ||
      candidate.status === status;

    return matchesSearch && matchesStatus;
  });

  // Statistics
  const totalCandidates = candidates.length;

  const shortlisted = candidates.filter(
    (candidate) => candidate.status === "Shortlisted"
  ).length;

  const interviews = candidates.filter(
    (candidate) => candidate.status === "Interview"
  ).length;

  const hired = candidates.filter(
    (candidate) => candidate.status === "Hired"
  ).length;

  // Document title
  useEffect(() => {
    document.title =
      `${totalCandidates} Candidates | CareerConnect`;
  }, [totalCandidates]);

  return (
    <div className="app">

      <DashboardHeader />

      <main className="dashboard">

        <section className="stats-grid">

          <StatsCard
            title="Total Candidates"
            value={totalCandidates}
          />

          <StatsCard
            title="Shortlisted"
            value={shortlisted}
          />

          <StatsCard
            title="Interviews"
            value={interviews}
          />

          <StatsCard
            title="Hired"
            value={hired}
          />

        </section>

        <section className="controls">

          <SearchBar
            search={search}
            setSearch={setSearch}
          />

          <StatusFilter
            status={status}
            setStatus={setStatus}
          />

          <button
            className="refresh-button"
            onClick={refreshCandidates}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>

        </section>

        {lastUpdated && !loading && (
          <p className="last-updated">
            Last updated:{" "}
            {lastUpdated.toLocaleTimeString()}
          </p>
        )}

        {loading && <LoadingState />}

        {!loading && error && (
          <div className="error-state">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          filteredCandidates.length === 0 && (
            <div className="empty-state">
              No candidates found.
            </div>
          )}

        {!loading &&
          !error &&
          filteredCandidates.length > 0 && (
            <CandidateList
              candidates={filteredCandidates}
            />
          )}

      </main>
    </div>
  );
}