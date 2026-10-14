import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/authorize.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/users", protect, authorize("admin"), async (req, res) => {
  const users = await User.find();
  res.json({ success: true, data: users });
});

export default router;