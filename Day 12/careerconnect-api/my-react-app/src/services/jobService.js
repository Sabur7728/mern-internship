import jobs from "../data/jobs.js";
import { ApiError, parseId, has, same, nextId, pick } from "../utils/helpers.js";

const FIELDS = ["title", "company", "location", "employmentType", "experience", "salary", "skills", "description", "status"];
const REQUIRED = ["title", "company", "location", "employmentType", "experience"];

function validate(data, partial = false) {
  for (const field of REQUIRED) {
    if (data[field] === undefined) {
      if (!partial) throw new ApiError(400, `${field} is required`);
    } else if (data[field] === "" || data[field] === null) {
      throw new ApiError(400, `${field} cannot be empty`);
    }
  }
  if (data.skills === undefined ? !partial : !Array.isArray(data.skills)) {
    throw new ApiError(400, "skills must be an array");
  }
}

function findOrFail(idParam) {
  const id = parseId(idParam);
  const job = jobs.find((j) => j.id === id);
  if (!job) throw new ApiError(404, "Job not found");
  return job;
}

export function getJobs({ search, location, employmentType, status } = {}) {
  let results = jobs;
  if (search) {
    results = results.filter(
      (j) => has(j.title, search) || has(j.company, search) || j.skills.some((s) => has(s, search))
    );
  }
  if (location) results = results.filter((j) => same(j.location, location));
  if (employmentType) results = results.filter((j) => same(j.employmentType, employmentType));
  if (status) results = results.filter((j) => same(j.status, status));
  return results;
}

export const getJobById = (id) => findOrFail(id);

export function createJob(data) {
  validate(data);
  const job = { id: nextId(jobs), salary: "", description: "", status: "Open", ...pick(data, FIELDS) };
  jobs.push(job);
  return job;
}

export function replaceJob(idParam, data) {
  const existing = findOrFail(idParam);
  validate(data);
  const index = jobs.indexOf(existing);
  jobs[index] = { id: existing.id, salary: "", description: "", status: "Open", ...pick(data, FIELDS) };
  return jobs[index];
}

export function updateJob(idParam, data) {
  const job = findOrFail(idParam);
  validate(data, true);
  return Object.assign(job, pick(data, FIELDS));
}

export function removeJob(idParam) {
  const job = findOrFail(idParam);
  jobs.splice(jobs.indexOf(job), 1);
  return job;
}