import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './layouts/Layout.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Jobs from './pages/Jobs.jsx';
import JobDetail from './pages/JobDetail.jsx';
import NotFound from './pages/NotFound.jsx';
import CandidateDashboard from './pages/candidate/Dashboard.jsx';
import CandidateProfile from './pages/candidate/Profile.jsx';
import CandidateApplications from './pages/candidate/Applications.jsx';
import RecruiterDashboard from './pages/recruiter/Dashboard.jsx';
import RecruiterJobs from './pages/recruiter/MyJobs.jsx';
import JobForm from './pages/recruiter/JobForm.jsx';
import RecruiterApplications from './pages/recruiter/Applications.jsx';
import RecruiterCandidates from './pages/recruiter/Candidates.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminTable from './pages/admin/AdminTable.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="jobs/:id" element={<JobDetail />} />

        <Route element={<ProtectedRoute roles={['candidate']} />}>
          <Route path="candidate" element={<CandidateDashboard />} />
          <Route path="candidate/profile" element={<CandidateProfile />} />
          <Route path="candidate/applications" element={<CandidateApplications />} />
        </Route>

        <Route element={<ProtectedRoute roles={['recruiter']} />}>
          <Route path="recruiter" element={<RecruiterDashboard />} />
          <Route path="recruiter/jobs" element={<RecruiterJobs />} />
          <Route path="recruiter/jobs/new" element={<JobForm />} />
          <Route path="recruiter/jobs/:id/edit" element={<JobForm />} />
          <Route path="recruiter/applications" element={<RecruiterApplications />} />
          <Route path="recruiter/candidates" element={<RecruiterCandidates />} />
        </Route>

        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/:resource" element={<AdminTable />} />
        </Route>

        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
