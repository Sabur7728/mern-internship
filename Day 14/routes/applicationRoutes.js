import express from "express";
import {
  createApplication,
  listApplications,
  getApplicationById,
  updateApplication,
  deleteApplication
} from "../controllers/applicationController.js";

const router = express.Router();

router.route("/").post(createApplication).get(listApplications);
router
  .route("/:id")
  .get(getApplicationById)
  .patch(updateApplication)
  .delete(deleteApplication);

export default router;