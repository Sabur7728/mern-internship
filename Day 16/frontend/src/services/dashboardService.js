import { apiRequest } from "./api";

export const getDashboardStats = () => apiRequest("/dashboard/stats");