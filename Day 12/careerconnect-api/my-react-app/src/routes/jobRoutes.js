import express from "express";
import {
  getJobs, getJobById, createJob, replaceJob, updateJob, deleteJob,
} from "../controllers/jobController.js";

const router = express.Router();

router.route("/").get(getJobs).post(createJob);
router.route("/:id").get(getJobById).put(replaceJob).patch(updateJob).delete(deleteJob);

export default router;