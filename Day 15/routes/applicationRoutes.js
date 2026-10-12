import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/authorize.js";
import { createApplication, getApplications } from "../controllers/applicationController.js";

const router = express.Router();

router.post("/", protect, authorize("candidate"), createApplication);
router.get("/", protect, getApplications);

export default router;
