import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler, httpError, pick } from "../utils/helpers.js";

const signToken = (user) =>
  jwt.sign({ sub: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, location } = req.body;
  if (!name || !email || !password) throw httpError(400, "Name, email and password are required");
  if (password.length < 8) throw httpError(400, "Password must be at least 8 characters");

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) throw httpError(409, "Email already registered");

  // role is NEVER read from req.body -> always "candidate"
  const user = await User.create({ name, email, password, phone, location });
  res.status(201).json({ message: "Registration successful", user: user.toPublic() });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw httpError(400, "Email and password are required");

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw httpError(401, "Invalid email or password");
  }
  if (!user.isActive) throw httpError(403, "Account is inactive");

  res.json({ token: signToken(user), user: user.toPublic() });
});

export const getProfile = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toPublic() });
});

export const updateProfile = asyncHandler(async (req, res) => {
  Object.assign(req.user, pick(req.body, ["name", "phone", "location"]));
  await req.user.save();
  res.json({ user: req.user.toPublic() });
});