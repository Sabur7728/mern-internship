import Company from '../models/Company.js';
import Job from '../models/Job.js';
import { escapeRegex, pageMeta, parsePagination } from '../utils/helpers.js';

// Builds a MongoDB filter from query string: search, location, employmentType, experience, salaryMin, skills, status
export async function buildJobFilter(q, { publicOnly = true } = {}) {
  const f = {};
  if (publicOnly) f.status = 'Open';
  else if (q.status) f.status = q.status;
  if (q.employmentType) f.employmentType = q.employmentType;
  if (q.location) f.location = new RegExp(escapeRegex(q.location), 'i');
  if (q.experience !== undefined && q.experience !== '') f.experienceMin = { $lte: Number(q.experience) };
  if (q.salaryMin) f.salaryMax = { $gte: Number(q.salaryMin) };
  if (q.skills) {
    const list = String(q.skills).split(',').map((s) => s.trim()).filter(Boolean);
    if (list.length) f.skills = { $in: list.map((s) => new RegExp(`^${escapeRegex(s)}$`, 'i')) };
  }
  if (q.search) {
    const rx = new RegExp(escapeRegex(q.search), 'i');
    const companies = await Company.find({ name: rx }).select('_id');
    f.$or = [{ title: rx }, { skills: rx }, { location: rx }, { description: rx }, { company: { $in: companies.map((c) => c._id) } }];
  }
  return f;
}

export async function queryJobs(filter, q) {
  const { page, limit, skip } = parsePagination(q);
  const [data, total] = await Promise.all([
    Job.find(filter).sort('-createdAt').skip(skip).limit(limit)
      .populate('company', 'name location industry website').populate('recruiter', 'name'),
    Job.countDocuments(filter),
  ]);
  return { data, pagination: pageMeta(page, limit, total) };
}

export async function findOrCreateCompany(name, user, location) {
  const clean = String(name).trim();
  const existing = await Company.findOne({ name: clean }).collation({ locale: 'en', strength: 2 });
  if (existing) return existing;
  return Company.create({ name: clean, location, createdBy: user._id });
}
