import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Candidates from "./pages/Candidates";
import AddCandidate from "./pages/AddCandidate";
import Jobs from "./pages/Jobs";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ display: "flex", gap: 16, padding: 16, justifyContent: "center" }}>
        <Link to="/jobs">Jobs</Link>
        <Link to="/candidates">Candidates</Link>
        <Link to="/candidates/add">Add Candidate</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/jobs" replace />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/candidates/add" element={<AddCandidate />} />
      </Routes>
    </BrowserRouter>
  );
}