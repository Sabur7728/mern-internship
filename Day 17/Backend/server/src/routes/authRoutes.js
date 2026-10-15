const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const sendAuth = (res, status, user) => {
  res.status(status).json({
    success: true,
    token: signToken(user._id),
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    // Only allow self-registration as candidate or recruiter (never admin)
    const safeRole = ["candidate", "recruiter"].includes(role) ? role : "candidate";
    const user = await User.create({ name, email, password, role: safeRole });
    sendAuth(res, 201, user);
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    sendAuth(res, 200, user);
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get("/me", protect, (req, res) => {
  const u = req.user;
  res.json({ success: true, user: { id: u._id, name: u.name, email: u.email, role: u.role } });
});

module.exports = router;