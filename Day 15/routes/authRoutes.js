import express from "express";
import rateLimit from "express-rate-limit";
import { register, login, getProfile } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { success: false, message: "Too many login attempts, try again later" }
});

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.get("/profile", protect, getProfile);

export default router;