import { createCrudService } from "./crudService";
import { apiRequest } from "./api";
export const getMyProfile = () => apiRequest("/candidates/me");
export const applyToJob = (jobId) =>
  apiRequest("/applications", { method: "POST", body: JSON.stringify({ job: jobId }) });

const service = createCrudService("candidates");
export const getCandidates = service.getAll;
export const getCandidateById = service.getById;
export const createCandidate = service.create;
export const updateCandidate = service.update;
export const deleteCandidate = service.remove;

export const getApplications = (q = "") => apiRequest(`/applications${q}`);
export const updateApplicationStatus = (id, status) =>
  apiRequest(`/applications/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });