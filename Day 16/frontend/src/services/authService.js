import { apiRequest } from "./api";

export const login = (credentials) =>
  apiRequest("/auth/login", { method: "POST", body: JSON.stringify(credentials) });

export const register = (data) =>
  apiRequest("/auth/register", { method: "POST", body: JSON.stringify(data) });

export const getProfile = () => apiRequest("/auth/profile");