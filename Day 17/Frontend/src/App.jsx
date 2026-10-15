import { Routes, Route, Navigate, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import JobsPage from "./pages/JobsPage";
import JobDetails from "./pages/JobDetails";
import CandidatesPage from "./pages/CandidatesPage";
import CandidateDetails from "./pages/CandidateDetails";
import CompaniesPage from "./pages/CompaniesPage";
import CompanyDetails from "./pages/CompanyDetails";
import ApplicationsPage from "./pages/ApplicationsPage";
import MyProfilePage from "./pages/MyProfilePage";

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

const titles = {
  "/jobs": "Job Management",
  "/candidates": "Candidate Management",
  "/companies": "Company Management",
  "/applications": "Applications",
  "/profile": "My Profile",
};

export default function App() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const routes = (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/jobs" replace /> : <LoginPage />} />
      <Route path="/jobs" element={<Protected><JobsPage /></Protected>} />
      <Route path="/jobs/:id" element={<Protected><JobDetails /></Protected>} />
      <Route path="/candidates" element={<Protected><CandidatesPage /></Protected>} />
      <Route path="/candidates/:id" element={<Protected><CandidateDetails /></Protected>} />
      <Route path="/companies" element={<Protected><CompaniesPage /></Protected>} />
      <Route path="/companies/:id" element={<Protected><CompanyDetails /></Protected>} />
      <Route path="/applications" element={<Protected><ApplicationsPage /></Protected>} />
      <Route path="/profile" element={<Protected><MyProfilePage /></Protected>} />
      <Route path="*" element={<Navigate to={user ? "/jobs" : "/login"} replace />} />
    </Routes>
  );

  // Login page: sidebar nahi
  if (!user) return routes;

  const isStaff = ["recruiter", "admin"].includes(user.role);
  const title =
    titles[pathname] ||
    (pathname.startsWith("/jobs/")
      ? "Job Details"
      : pathname.startsWith("/candidates/")
      ? "Candidate Details"
      : pathname.startsWith("/companies/")
      ? "Company Details"
      : "CareerConnect");

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand"><span>CC</span> CareerConnect</div>
        <NavLink to="/jobs">💼 Jobs</NavLink>
        {isStaff && <NavLink to="/candidates">👥 Candidates</NavLink>}
        <NavLink to="/companies">🏢 Companies</NavLink>
        <NavLink to="/applications">📄 Applications</NavLink>
        {user.role === "candidate" && <NavLink to="/profile">🙋 My Profile</NavLink>}
        <button className="logout" onClick={logout}>⎋ Logout</button>
      </aside>

      <div className="main">
        <header className="topbar">
          <h1>{title}</h1>
          <div className="user-box">
            <div style={{ textAlign: "right" }}>
              <strong>{user.name}</strong>
              <small>{user.role}</small>
            </div>
            <div className="avatar">{user.name?.[0]?.toUpperCase()}</div>
          </div>
        </header>
        <main className="content">{routes}</main>
      </div>
    </div>
  );
}