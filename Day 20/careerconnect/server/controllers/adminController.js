import User from '../models/User.js';
import Job from '../models/Job.js';
import Company from '../models/Company.js';
import Candidate from '../models/Candidate.js';
import Application from '../models/Application.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { escapeRegex, pageMeta, parsePagination } from '../utils/helpers.js';
import { buildJobFilter, queryJobs } from '../services/jobService.js';

export const stats = asyncHandler(async (_req, res) => {
  const [users, jobs, companies, candidates, applications, byStatus, byRole] = await Promise.all([
    User.countDocuments(), Job.countDocuments(), Company.countDocuments(), Candidate.countDocuments(), Application.countDocuments(),
    Application.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
  ]);
  res.json({
    success: true,
    data: {
      users, jobs, companies, candidates, applications,
      applicationsByStatus: Object.fromEntries(byStatus.map((s) => [s._id, s.count])),
      usersByRole: Object.fromEntries(byRole.map((s) => [s._id, s.count])),
    },
  });
});

export const listUsers = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.search) {
    const rx = new RegExp(escapeRegex(req.query.search), 'i');
    filter.$or = [{ name: rx }, { email: rx }];
  }
  const { page, limit, skip } = parsePagination({ ...req.query, limit: req.query.limit || 100 });
  const [data, total] = await Promise.all([User.find(filter).sort('-createdAt').skip(skip).limit(limit), User.countDocuments(filter)]);
  res.json({ success: true, data, pagination: pageMeta(page, limit, total) });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  if (user._id.equals(req.user._id)) throw new ApiError(400, 'You cannot modify your own account here');
  const { status, role } = req.body;
  if (status !== undefined) {
    if (!['active', 'suspended'].includes(status)) throw new ApiError(400, 'Invalid status');
    user.status = status;
  }
  if (role !== undefined) {
    if (!['candidate', 'recruiter', 'admin'].includes(role)) throw new ApiError(400, 'Invalid role');
    user.role = role;
  }
  await user.save();
  res.json({ success: true, data: user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  if (user._id.equals(req.user._id)) throw new ApiError(400, 'You cannot delete your own account');

  if (user.role === 'candidate') {
    const c = await Candidate.findOne({ user: user._id });
    if (c) { await Application.deleteMany({ candidate: c._id }); await c.deleteOne(); }
  } else if (user.role === 'recruiter') {
    const jobIds = await Job.find({ recruiter: user._id }).distinct('_id');
    await Application.deleteMany({ job: { $in: jobIds } });
    await Job.deleteMany({ recruiter: user._id });
  }
  await user.deleteOne();
  res.json({ success: true, message: 'User and related data deleted' });
});

export const listCompanies = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: await Company.find().sort('name') });
});

export const updateCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) throw new ApiError(404, 'Company not found');
  ['name', 'description', 'website', 'industry', 'location', 'logoUrl'].forEach((k) => { if (req.body[k] !== undefined) company[k] = req.body[k]; });
  await company.save();
  res.json({ success: true, data: company });
});

export const deleteCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) throw new ApiError(404, 'Company not found');
  if (await Job.exists({ company: company._id })) throw new ApiError(409, 'Company still has jobs. Delete the jobs first.');
  await company.deleteOne();
  res.json({ success: true, message: 'Company deleted' });
});

export const listAllJobs = asyncHandler(async (req, res) => {
  const filter = await buildJobFilter(req.query, { publicOnly: false });
  res.json({ success: true, ...(await queryJobs(filter, { ...req.query, limit: req.query.limit || 100 })) });
});
