import { apiRequest, buildQuery } from "./api";

export const getCandidates = (params) => apiRequest(`/candidates${buildQuery(params)}`);

export const getCandidateById = (id) => apiRequest(`/candidates/${id}`);

export const createCandidate = (data) =>
  apiRequest("/candidates", { method: "POST", body: JSON.stringify(data) });

export const updateCandidate = (id, data) =>
  apiRequest(`/candidates/${id}`, { method: "PATCH", body: JSON.stringify(data) });