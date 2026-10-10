import express from "express";
import {
  createJob,
  listJobs,
  getJobById,
  updateJob,
  deleteJob
} from "../controllers/jobController.js";

const router = express.Router();

router.route("/").post(createJob).get(listJobs);
router.route("/:id").get(getJobById).patch(updateJob).delete(deleteJob);

export default router;
