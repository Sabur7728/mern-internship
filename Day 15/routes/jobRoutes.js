import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/authorize.js";
import {
  getJobs,
  createJob,
  updateJob,
  deleteJob
} from "../controllers/jobController.js";

const router = express.Router();

router.get("/", getJobs); // public
router.post("/", protect, authorize("recruiter", "admin"), createJob);
router.patch("/:id", protect, authorize("recruiter", "admin"), updateJob);
router.delete("/:id", protect, authorize("recruiter", "admin"), deleteJob);

export default router;
