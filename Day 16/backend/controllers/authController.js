import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register = async (req, res) => {
  const name = req.body.name?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  if (!name || name.length < 2)
    return res.status(400).json({ success: false, message: "Name must be at least 2 characters" });
  if (!email || !emailRegex.test(email))
    return res.status(400).json({ success: false, message: "Valid email is required" });
  if (typeof password !== "string" || password.length < 8)
    return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });

  if (await User.findOne({ email }))
    return res.status(409).json({ success: false, message: "Email already registered" });

  const hashed = await bcrypt.hash(password, 12);

  // role is NOT read from req.body, so it defaults to "candidate"
  const user = await User.create({ name, email, password: hashed });

  res.status(201).json({
    success: true,
    message: "Registration successful",
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
};

export const login = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  if (!email || !password)
    return res.status(400).json({ success: false, message: "Email and password are required" });

  const user = await User.findOne({ email }).select("+password");
  const invalid = () =>
    res.status(401).json({ success: false, message: "Invalid email or password" });

  if (!user) return invalid();
  if (!user.isActive)
    return res.status(403).json({ success: false, message: "Account is deactivated" });
  if (!(await bcrypt.compare(password, user.password))) return invalid();

  const token = jwt.sign(
    { userId: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );

  res.json({
    success: true,
    message: "Login successful",
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
};

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  res.json({
    success: true,
    data: {
      id: user._id, name: user.name, email: user.email,
      role: user.role, isActive: user.isActive, createdAt: user.createdAt
    }
  });
};