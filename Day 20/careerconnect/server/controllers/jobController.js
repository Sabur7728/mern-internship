import Job from '../models/Job.js';
import Application from '../models/Application.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { pickJob, validateJob } from '../validators/index.js';
import { buildJobFilter, queryJobs, findOrCreateCompany } from '../services/jobService.js';

const canManage = (job, user) => user.role === 'admin' || job.recruiter.equals(user._id);

export const listJobs = asyncHandler(async (req, res) => {
  const filter = await buildJobFilter(req.query, { publicOnly: true });
  res.json({ success: true, ...(await queryJobs(filter, req.query)) });
});

export const myJobs = asyncHandler(async (req, res) => {
  const filter = await buildJobFilter(req.query, { publicOnly: false });
  filter.recruiter = req.user._id;
  const result = await queryJobs(filter, { ...req.query, limit: req.query.limit || 50 });
  const counts = await Application.aggregate([
    { $match: { job: { $in: result.data.map((j) => j._id) } } },
    { $group: { _id: '$job', count: { $sum: 1 } } },
  ]);
  const map = Object.fromEntries(counts.map((c) => [String(c._id), c.count]));
  const data = result.data.map((j) => ({ ...j.toJSON(), applicationCount: map[String(j._id)] || 0 }));
  res.json({ success: true, data, pagination: result.pagination });
});

export const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate('company').populate('recruiter', 'name');
  if (!job) throw new ApiError(404, 'Job not found');
  res.json({ success: true, data: job });
});

export const createJob = asyncHandler(async (req, res) => {
  const data = pickJob(req.body);
  const errors = validateJob(data);
  const companyName = String(req.body.companyName || '').trim();
  if (!companyName) errors.push('Company name is required');
  if (errors.length) throw new ApiError(400, 'Validation failed', errors);

  const company = await findOrCreateCompany(companyName, req.user, data.location);
  const job = await Job.create({ ...data, company: company._id, recruiter: req.user._id });
  await job.populate('company', 'name location');
  res.status(201).json({ success: true, data: job });
});

export const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new ApiError(404, 'Job not found');
  if (!canManage(job, req.user)) throw new ApiError(403, 'You can only modify your own jobs'); // ownership check

  const changes = pickJob(req.body);
  const merged = { ...pickJob(job.toObject()), ...changes };
  const errors = validateJob(merged);
  if (errors.length) throw new ApiError(400, 'Validation failed', errors);

  Object.assign(job, changes);
  await job.save();
  await job.populate('company', 'name location');
  res.json({ success: true, data: job });
});

export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new ApiError(404, 'Job not found');
  if (!canManage(job, req.user)) throw new ApiError(403, 'You can only delete your own jobs');

  await Application.deleteMany({ job: job._id });
  await job.deleteOne();
  res.json({ success: true, message: 'Job deleted' });
});
