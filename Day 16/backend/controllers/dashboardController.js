import { getDashboardStats } from "../services/dashboardService.js";

export const getStats = async (req, res) => {
  try {
    const data = await getDashboardStats(req.user);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};