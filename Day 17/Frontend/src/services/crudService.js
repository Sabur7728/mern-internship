import { apiRequest } from "./api";

export const createCrudService = (resource) => ({
  getAll: (query = "") => apiRequest(`/${resource}${query}`),
  getById: (id) => apiRequest(`/${resource}/${id}`),
  create: (data) => apiRequest(`/${resource}`, { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    apiRequest(`/${resource}/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  remove: (id) => apiRequest(`/${resource}/${id}`, { method: "DELETE" }),
});