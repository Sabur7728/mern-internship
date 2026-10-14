import express from "express";
import { getStats } from "../controllers/dashboardController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/stats", authenticate, authorize("recruiter", "admin"), getStats);

export default router;