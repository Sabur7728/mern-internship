import express from "express";
import {
  createCandidate,
  listCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate
} from "../controllers/candidateController.js";

const router = express.Router();

router.route("/").post(createCandidate).get(listCandidates);
router
  .route("/:id")
  .get(getCandidateById)
  .patch(updateCandidate)
  .delete(deleteCandidate);

export default router;