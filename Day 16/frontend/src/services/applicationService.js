import { apiRequest } from "./api";

export const createApplication = (data) =>
  apiRequest("/applications", { method: "POST", body: JSON.stringify(data) });

export const getApplications = () => apiRequest("/applications");
export const updateApplicationStatus = (id, status) =>
  apiRequest(`/applications/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });