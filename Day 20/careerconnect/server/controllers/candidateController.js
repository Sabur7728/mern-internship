import Candidate from '../models/Candidate.js';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { escapeRegex, pageMeta, parsePagination, toList } from '../utils/helpers.js';

const EDITABLE = ['name', 'phone', 'location', 'skills', 'experienceYears', 'education', 'resumeUrl', 'summary'];

const applyUpdates = async (candidate, body) => {
  EDITABLE.forEach((k) => {
    if (body[k] === undefined) return;
    if (k === 'skills') candidate.skills = toList(body.skills);
    else if (k === 'experienceYears') candidate.experienceYears = Number(body.experienceYears) || 0;
    else candidate[k] = typeof body[k] === 'string' ? body[k].trim() : body[k];
  });
  await candidate.save();
  if (body.name) await User.findByIdAndUpdate(candidate.user, { name: candidate.name });
  return candidate;
};

export const getMe = asyncHandler(async (req, res) => {
  const c = await Candidate.findOne({ user: req.user._id });
  if (!c) throw new ApiError(404, 'Candidate profile not found');
  res.json({ success: true, data: c });
});

export const updateMe = asyncHandler(async (req, res) => {
  const c = await Candidate.findOne({ user: req.user._id });
  if (!c) throw new ApiError(404, 'Candidate profile not found');
  res.json({ success: true, data: await applyUpdates(c, req.body) });
});

// Recruiters see only candidates who applied to THEIR jobs. Admin sees all.
export const listCandidates = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role === 'recruiter') {
    const jobIds = await Job.find({ recruiter: req.user._id }).distinct('_id');
    filter._id = { $in: await Application.find({ job: { $in: jobIds } }).distinct('candidate') };
  }
  if (req.query.search) {
    const rx = new RegExp(escapeRegex(req.query.search), 'i');
    filter.$or = [{ name: rx }, { skills: rx }, { location: rx }];
  }
  const { page, limit, skip } = parsePagination(req.query);
  const [data, total] = await Promise.all([
    Candidate.find(filter).sort('-createdAt').skip(skip).limit(limit),
    Candidate.countDocuments(filter),
  ]);
  res.json({ success: true, data, pagination: pageMeta(page, limit, total) });
});

export const getCandidate = asyncHandler(async (req, res) => {
  const c = await Candidate.findById(req.params.id);
  if (!c) throw new ApiError(404, 'Candidate not found');
  let allowed = req.user.role === 'admin' || c.user.equals(req.user._id);
  if (!allowed && req.user.role === 'recruiter') {
    const jobIds = await Job.find({ recruiter: req.user._id }).distinct('_id');
    allowed = !!(await Application.exists({ candidate: c._id, job: { $in: jobIds } }));
  }
  if (!allowed) throw new ApiError(403, 'You cannot view this candidate');
  res.json({ success: true, data: c });
});

export const createCandidate = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.user);
  if (!user || user.role !== 'candidate') throw new ApiError(400, 'A valid candidate user id is required');
  if (await Candidate.exists({ user: user._id })) throw new ApiError(409, 'Candidate profile already exists');
  const c = await Candidate.create({ user: user._id, name: user.name, email: user.email });
  res.status(201).json({ success: true, data: await applyUpdates(c, req.body) });
});

export const updateCandidate = asyncHandler(async (req, res) => {
  const c = await Candidate.findById(req.params.id);
  if (!c) throw new ApiError(404, 'Candidate not found');
  if (req.user.role !== 'admin' && !c.user.equals(req.user._id)) throw new ApiError(403, "You cannot modify another candidate's profile");
  res.json({ success: true, data: await applyUpdates(c, req.body) });
});

export const deleteCandidate = asyncHandler(async (req, res) => {
  const c = await Candidate.findById(req.params.id);
  if (!c) throw new ApiError(404, 'Candidate not found');
  await Application.deleteMany({ candidate: c._id });
  await User.findByIdAndDelete(c.user);
  await c.deleteOne();
  res.json({ success: true, message: 'Candidate deleted' });
});
