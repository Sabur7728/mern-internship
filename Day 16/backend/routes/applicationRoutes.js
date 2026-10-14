import express from "express";
import {
  createApplication,
  getApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getApplications);
router.post("/", authorize("candidate"), createApplication);
router.patch("/:id", authorize("recruiter", "admin"), updateApplicationStatus);

export default router;