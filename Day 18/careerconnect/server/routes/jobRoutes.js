import { Router } from "express";
import {
  getJobs, getManagedJobs, getJob, createJob, updateJob, deleteJob,
} from "../controllers/jobController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();
router.use(authenticate);

router.get("/", getJobs);
router.get("/manage", authorize("recruiter", "admin"), getManagedJobs); // before /:id
router.get("/:id", getJob);
router.post("/", authorize("recruiter", "admin"), createJob);
router.put("/:id", authorize("recruiter", "admin"), updateJob);   // ownership checked in controller
router.delete("/:id", authorize("recruiter", "admin"), deleteJob);
export default router;