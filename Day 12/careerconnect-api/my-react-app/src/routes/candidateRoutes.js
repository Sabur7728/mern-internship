import express from "express";
import {
  getCandidates, getCandidateById, createCandidate,
  replaceCandidate, updateCandidate, deleteCandidate,
} from "../controllers/candidateController.js";

const router = express.Router();

router.route("/").get(getCandidates).post(createCandidate);
router.route("/:id").get(getCandidateById).put(replaceCandidate).patch(updateCandidate).delete(deleteCandidate);

export default router;
