import { apiRequest } from "./api";

export const login = (credentials) =>
  apiRequest("/auth/login", { method: "POST", auth: false, body: JSON.stringify(credentials) });

export const register = (data) =>
  apiRequest("/auth/register", { method: "POST", auth: false, body: JSON.stringify(data) });

export const getProfile = () => apiRequest("/auth/profile");

export const updateProfile = (data) =>
  apiRequest("/auth/profile", { method: "PUT", body: JSON.stringify(data) });