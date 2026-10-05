import { Routes, Route } from "react-router";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Candidates from "./pages/Candidates";
import CandidateDetails from "./pages/CandidateDetails";
import AddCandidate from "./pages/AddCandidate";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/jobs" element={<Jobs />} />

          <Route path="/jobs/:jobId" element={<JobDetails />} />

          <Route path="/candidates" element={<Candidates />} />

          <Route
            path="/candidates/:candidateId"
            element={<CandidateDetails />}
          />

          <Route
            path="/candidates/new"
            element={<AddCandidate />}
          />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

export default App;