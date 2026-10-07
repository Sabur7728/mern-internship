import candidates from "../data/candidates.js";
import { ApiError, parseId, has, same, nextId, pick } from "../utils/helpers.js";

const FIELDS = ["name", "email", "phone", "position", "experience", "location", "status", "skills", "appliedDate"];
const REQUIRED = ["name", "email", "position", "experience", "location", "status"];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(data, partial = false) {
  for (const field of REQUIRED) {
    if (data[field] === undefined) {
      if (!partial) throw new ApiError(400, `${field} is required`);
    } else if (data[field] === "" || data[field] === null) {
      throw new ApiError(400, `${field} cannot be empty`);
    }
  }
  if (data.email !== undefined && !EMAIL_REGEX.test(data.email)) {
    throw new ApiError(400, "Invalid email format");
  }
  if (data.experience !== undefined && (data.experience === "" || isNaN(Number(data.experience)))) {
    throw new ApiError(400, "experience must be a valid number");
  }
  if (data.skills === undefined ? !partial : !Array.isArray(data.skills)) {
    throw new ApiError(400, "skills must be an array");
  }
}

function findOrFail(idParam) {
  const id = parseId(idParam);
  const candidate = candidates.find((c) => c.id === id);
  if (!candidate) throw new ApiError(404, "Candidate not found");
  return candidate;
}

function clean(data) {
  const out = pick(data, FIELDS);
  if (out.experience !== undefined) out.experience = Number(out.experience);
  return out;
}

export function getCandidates({ search, status, location, position } = {}) {
  let results = candidates;
  if (search) {
    results = results.filter(
      (c) => has(c.name, search) || has(c.email, search) || has(c.position, search) || c.skills.some((s) => has(s, search))
    );
  }
  if (status) results = results.filter((c) => same(c.status, status));
  if (location) results = results.filter((c) => same(c.location, location));
  if (position) results = results.filter((c) => has(c.position, position));
  return results;
}

export const getCandidateById = (id) => findOrFail(id);

export function createCandidate(data) {
  validate(data);
  const candidate = {
    id: nextId(candidates),
    phone: "",
    appliedDate: new Date().toISOString().slice(0, 10),
    ...clean(data),
  };
  candidates.push(candidate);
  return candidate;
}

export function replaceCandidate(idParam, data) {
  const existing = findOrFail(idParam);
  validate(data);
  const index = candidates.indexOf(existing);
  candidates[index] = { id: existing.id, phone: "", appliedDate: existing.appliedDate, ...clean(data) };
  return candidates[index];
}

export function updateCandidate(idParam, data) {
  const candidate = findOrFail(idParam);
  validate(data, true);
  return Object.assign(candidate, clean(data));
}

export function removeCandidate(idParam) {
  const candidate = findOrFail(idParam);
  candidates.splice(candidates.indexOf(candidate), 1);
  return candidate;
}