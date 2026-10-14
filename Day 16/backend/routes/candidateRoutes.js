import express from "express";
import {
  getCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
} from "../controllers/candidateController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate, authorize("recruiter", "admin"));

router.get("/", getCandidates);
router.get("/:id", getCandidateById);
router.post("/", createCandidate);
router.patch("/:id", updateCandidate);

export default router;