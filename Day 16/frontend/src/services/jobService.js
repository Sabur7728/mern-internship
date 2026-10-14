import { apiRequest, buildQuery } from "./api";

export const getJobs = (params) => apiRequest(`/jobs${buildQuery(params)}`);

export const getJobById = (id) => apiRequest(`/jobs/${id}`);

export const createJob = (data) =>
  apiRequest("/jobs", { method: "POST", body: JSON.stringify(data) });