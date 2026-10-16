import { apiRequest } from "./api";

const json = (method, body) => ({ method, body: JSON.stringify(body) });

export const jobService = {
  list: () => apiRequest("/jobs"),
  managed: () => apiRequest("/jobs/manage"),
  get: (id) => apiRequest(`/jobs/${id}`),
  create: (data) => apiRequest("/jobs", json("POST", data)),
  update: (id, data) => apiRequest(`/jobs/${id}`, json("PUT", data)),
  remove: (id) => apiRequest(`/jobs/${id}`, { method: "DELETE" }),
};

export const applicationService = {
  apply: (data) => apiRequest("/applications", json("POST", data)),
  mine: () => apiRequest("/applications/my"),
  managed: () => apiRequest("/applications/manage"),
  updateStatus: (id, status) => apiRequest(`/applications/${id}/status`, json("PATCH", { status })),
};

export const companyService = {
  list: () => apiRequest("/companies"),
  create: (data) => apiRequest("/companies", json("POST", data)),
  update: (id, data) => apiRequest(`/companies/${id}`, json("PUT", data)),
  remove: (id) => apiRequest(`/companies/${id}`, { method: "DELETE" }),
};

export const userService = {
  list: () => apiRequest("/users"),
  create: (data) => apiRequest("/users", json("POST", data)),
  update: (id, data) => apiRequest(`/users/${id}`, json("PUT", data)),
  remove: (id) => apiRequest(`/users/${id}`, { method: "DELETE" }),
};