import Application, { APPLICATION_STATUSES } from '../models/Application.js';
import Candidate from '../models/Candidate.js';
import Job from '../models/Job.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { pageMeta, parsePagination } from '../utils/helpers.js';

const populateApp = (q) =>
  q.populate({ path: 'job', select: 'title location status recruiter company', populate: { path: 'company', select: 'name' } })
    .populate('candidate', 'name email phone location skills experienceYears education resumeUrl summary');

export const createApplication = asyncHandler(async (req, res) => {
  const { jobId } = req.body;
  if (!jobId) throw new ApiError(400, 'jobId is required');
  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(404, 'Job not found');
  if (job.status !== 'Open') throw new ApiError(400, 'This job is closed');
  const candidate = await Candidate.findOne({ user: req.user._id });
  if (!candidate) throw new ApiError(404, 'Candidate profile not found');
  if (await Application.exists({ candidate: candidate._id, job: job._id })) throw new ApiError(409, 'You have already applied to this job');

  const app = await Application.create({ candidate: candidate._id, job: job._id });
  res.status(201).json({ success: true, data: await populateApp(Application.findById(app._id)) });
});

// Role-scoped listing: candidate -> own, recruiter -> applications to own jobs, admin -> all
export const listApplications = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role === 'candidate') {
    const c = await Candidate.findOne({ user: req.user._id });
    filter.candidate = c ? c._id : null;
  } else if (req.user.role === 'recruiter') {
    filter.job = { $in: await Job.find({ recruiter: req.user._id }).distinct('_id') };
  }
  if (req.query.status) filter.status = req.query.status;
  if (req.query.job && req.user.role !== 'recruiter') filter.job = req.query.job;
  if (req.query.job && req.user.role === 'recruiter' && filter.job.$in.some((id) => id.equals(req.query.job))) filter.job = req.query.job;

  const { page, limit, skip } = parsePagination({ ...req.query, limit: req.query.limit || 100 });
  const [data, total] = await Promise.all([
    populateApp(Application.find(filter).sort('-appliedAt').skip(skip).limit(limit)),
    Application.countDocuments(filter),
  ]);
  res.json({ success: true, data, pagination: pageMeta(page, limit, total) });
});

export const updateApplication = asyncHandler(async (req, res) => {
  const app = await Application.findById(req.params.id).populate('job', 'recruiter');
  if (!app) throw new ApiError(404, 'Application not found');
  if (req.user.role !== 'admin' && !app.job.recruiter.equals(req.user._id)) {
    throw new ApiError(403, 'You can only update applications for your own jobs'); // ownership
  }
  const { status, recruiterNotes } = req.body;
  if (status !== undefined) {
    if (!APPLICATION_STATUSES.includes(status)) throw new ApiError(400, `Status must be one of: ${APPLICATION_STATUSES.join(', ')}`);
    app.status = status;
  }
  if (recruiterNotes !== undefined) app.recruiterNotes = String(recruiterNotes);
  await app.save();
  res.json({ success: true, data: await populateApp(Application.findById(app._id)) });
});

export const deleteApplication = asyncHandler(async (req, res) => {
  const app = await Application.findById(req.params.id).populate('candidate', 'user');
  if (!app) throw new ApiError(404, 'Application not found');
  if (req.user.role === 'candidate') {
    if (!app.candidate.user.equals(req.user._id)) throw new ApiError(403, 'You can only withdraw your own applications');
    if (app.status !== 'Applied') throw new ApiError(400, 'Only applications with status "Applied" can be withdrawn');
  }
  await app.deleteOne();
  res.json({ success: true, message: 'Application removed' });
});
