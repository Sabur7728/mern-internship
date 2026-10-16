import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { roleHome } from "./utils/roles";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Forbidden from "./pages/Forbidden";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";

import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import CandidateJobs from "./pages/candidate/CandidateJobs";
import CandidateJobDetails from "./pages/candidate/CandidateJobDetails";
import MyApplications from "./pages/candidate/MyApplications";

import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import ManageJobs from "./pages/recruiter/ManageJobs";
import JobForm from "./pages/recruiter/JobForm";
import Applications from "./pages/recruiter/Applications";
import Candidates from "./pages/recruiter/Candidates";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCompanies from "./pages/admin/AdminCompanies";

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <p className="center">Loading...</p>;
  return <Navigate to={user ? roleHome[user.role] : "/login"} replace />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forbidden" element={<Forbidden />} />

          {/* Any logged-in user */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Candidate */}
          <Route element={<RoleRoute allowedRoles={["candidate"]} />}>
            <Route path="/candidate" element={<CandidateDashboard />} />
            <Route path="/candidate/jobs" element={<CandidateJobs />} />
            <Route path="/candidate/jobs/:id" element={<CandidateJobDetails />} />
            <Route path="/candidate/applications" element={<MyApplications />} />
          </Route>

          {/* Recruiter */}
          <Route element={<RoleRoute allowedRoles={["recruiter"]} />}>
            <Route path="/recruiter" element={<RecruiterDashboard />} />
            <Route path="/recruiter/jobs" element={<ManageJobs />} />
            <Route path="/recruiter/jobs/new" element={<JobForm />} />
            <Route path="/recruiter/jobs/:id/edit" element={<JobForm />} />
            <Route path="/recruiter/candidates" element={<Candidates />} />
            <Route path="/recruiter/applications" element={<Applications />} />
          </Route>

          {/* Admin */}
          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/companies" element={<AdminCompanies />} />
            <Route path="/admin/jobs" element={<ManageJobs />} />
            <Route path="/admin/jobs/new" element={<JobForm />} />
            <Route path="/admin/jobs/:id/edit" element={<JobForm />} />
            <Route path="/admin/candidates" element={<Candidates />} />
            <Route path="/admin/applications" element={<Applications />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}