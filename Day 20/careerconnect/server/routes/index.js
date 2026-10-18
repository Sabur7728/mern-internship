import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import * as auth from '../controllers/authController.js';
import * as jobs from '../controllers/jobController.js';
import * as cand from '../controllers/candidateController.js';
import * as apps from '../controllers/applicationController.js';
import * as admin from '../controllers/adminController.js';

const router = Router();

// Auth
router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);
router.post('/auth/logout', protect, auth.logout);
router.get('/auth/me', protect, auth.me);

// Jobs
router.get('/jobs', jobs.listJobs);
router.get('/jobs/mine', protect, authorize('recruiter'), jobs.myJobs);
router.get('/jobs/:id', jobs.getJob);
router.post('/jobs', protect, authorize('recruiter', 'admin'), jobs.createJob);
router.patch('/jobs/:id', protect, authorize('recruiter', 'admin'), jobs.updateJob);
router.put('/jobs/:id', protect, authorize('recruiter', 'admin'), jobs.updateJob);
router.delete('/jobs/:id', protect, authorize('recruiter', 'admin'), jobs.deleteJob);

// Candidates
router.get('/candidates/me', protect, authorize('candidate'), cand.getMe);
router.patch('/candidates/me', protect, authorize('candidate'), cand.updateMe);
router.get('/candidates', protect, authorize('recruiter', 'admin'), cand.listCandidates);
router.post('/candidates', protect, authorize('admin'), cand.createCandidate);
router.get('/candidates/:id', protect, authorize('candidate', 'recruiter', 'admin'), cand.getCandidate);
router.patch('/candidates/:id', protect, authorize('candidate', 'admin'), cand.updateCandidate);
router.delete('/candidates/:id', protect, authorize('admin'), cand.deleteCandidate);

// Applications
router.get('/applications', protect, apps.listApplications);
router.post('/applications', protect, authorize('candidate'), apps.createApplication);
router.patch('/applications/:id', protect, authorize('recruiter', 'admin'), apps.updateApplication);
router.delete('/applications/:id', protect, authorize('candidate', 'admin'), apps.deleteApplication);

// Admin
router.use('/admin', protect, authorize('admin'));
router.get('/admin/stats', admin.stats);
router.get('/admin/users', admin.listUsers);
router.patch('/admin/users/:id', admin.updateUser);
router.delete('/admin/users/:id', admin.deleteUser);
router.get('/admin/companies', admin.listCompanies);
router.patch('/admin/companies/:id', admin.updateCompany);
router.delete('/admin/companies/:id', admin.deleteCompany);
router.get('/admin/jobs', admin.listAllJobs);

export default router;
