import { EMPLOYMENT_TYPES } from '../models/Job.js';
import { toList } from '../utils/helpers.js';

const emailRx = /^\S+@\S+\.\S+$/;

export const validateRegister = (b) => {
  const e = [];
  if (!b.name || String(b.name).trim().length < 2) e.push('Name must be at least 2 characters');
  if (!b.email || !emailRx.test(String(b.email))) e.push('A valid email is required');
  if (!b.password || String(b.password).length < 8) e.push('Password must be at least 8 characters');
  if (b.role && !['candidate', 'recruiter'].includes(b.role)) e.push('Role must be candidate or recruiter');
  return e;
};

const JOB_FIELDS = ['title', 'description', 'location', 'employmentType', 'experienceMin', 'salaryMin', 'salaryMax', 'skills', 'status'];

// whitelist + normalise job input (prevents mass assignment)
export const pickJob = (b) => {
  const o = {};
  JOB_FIELDS.forEach((k) => { if (b[k] !== undefined) o[k] = b[k]; });
  ['title', 'description', 'location'].forEach((k) => { if (typeof o[k] === 'string') o[k] = o[k].trim(); });
  ['experienceMin', 'salaryMin', 'salaryMax'].forEach((k) => {
    if (o[k] !== undefined) o[k] = o[k] === '' || o[k] === null ? 0 : Number(o[k]);
  });
  if (o.skills !== undefined) o.skills = toList(o.skills);
  return o;
};

export const validateJob = (j) => {
  const e = [];
  if (!j.title || typeof j.title !== 'string' || j.title.length < 3) e.push('Title is required (min 3 characters)');
  if (!j.description || typeof j.description !== 'string' || j.description.length < 10) e.push('Description is required (min 10 characters)');
  if (!j.location || typeof j.location !== 'string' || /^[\d\W]+$/.test(j.location)) e.push('A valid location is required');
  if (j.employmentType && !EMPLOYMENT_TYPES.includes(j.employmentType)) e.push('Invalid employment type');
  if (j.status && !['Open', 'Closed'].includes(j.status)) e.push('Status must be Open or Closed');
  ['experienceMin', 'salaryMin', 'salaryMax'].forEach((k) => {
    if (j[k] !== undefined && (!Number.isFinite(j[k]) || j[k] < 0)) e.push(`${k} must be a non-negative number`);
  });
  if (j.experienceMin > 50) e.push('experienceMin cannot exceed 50');
  if (Number.isFinite(j.salaryMin) && Number.isFinite(j.salaryMax) && j.salaryMax < j.salaryMin) {
    e.push('salaryMax must be greater than or equal to salaryMin');
  }
  return e;
};
