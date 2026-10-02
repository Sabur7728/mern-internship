function Dashboard() {
  return (
    <div className="page">
      <h1>Dashboard</h1>

      <div className="stats">
        <div className="stat-card">
          <h2>10</h2>
          <p>Total Jobs</p>
        </div>

        <div className="stat-card">
          <h2>15</h2>
          <p>Total Candidates</p>
        </div>

        <div className="stat-card">
          <h2>6</h2>
          <p>Interviews</p>
        </div>

        <div className="stat-card">
          <h2>3</h2>
          <p>Hired</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;