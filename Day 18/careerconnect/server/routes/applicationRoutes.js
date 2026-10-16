import { Router } from "express";
import {
  applyToJob, myApplications, managedApplications, getApplication, updateApplicationStatus,
} from "../controllers/applicationController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();
router.use(authenticate);

router.post("/", authorize("candidate"), applyToJob);
router.get("/my", authorize("candidate"), myApplications);
router.get("/manage", authorize("recruiter", "admin"), managedApplications);
router.get("/:id", getApplication); // ownership checked in controller
router.patch("/:id/status", authorize("recruiter", "admin"), updateApplicationStatus);
export default router;