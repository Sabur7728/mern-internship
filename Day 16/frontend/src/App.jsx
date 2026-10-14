import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import CreateJob from "./pages/CreateJob";
import Candidates from "./pages/Candidates";
import CandidateDetails from "./pages/CandidateDetails";
import Applications from "./pages/Applications";
import RecruiterApplications from "./pages/RecruiterApplications";
import Dashboard from "./pages/Dashboard";

const STAFF = ["recruiter", "admin"];

function App() {
  return (
    <>
      <Navbar />
      <main style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<Jobs />} />

          {/* /jobs/new ko /jobs/:id se PEHLE rakhna */}
          <Route
            path="/jobs/new"
            element={
              <ProtectedRoute roles={STAFF}>
                <CreateJob />
              </ProtectedRoute>
            }
          />
          <Route path="/jobs/:id" element={<JobDetails />} />

          <Route
            path="/applications"
            element={
              <ProtectedRoute roles={["candidate"]}>
                <Applications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter/applications"
            element={
              <ProtectedRoute roles={STAFF}>
                <RecruiterApplications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/candidates"
            element={
              <ProtectedRoute roles={STAFF}>
                <Candidates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidates/:id"
            element={
              <ProtectedRoute roles={STAFF}>
                <CandidateDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={STAFF}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
    </>
  );
}

export default App;