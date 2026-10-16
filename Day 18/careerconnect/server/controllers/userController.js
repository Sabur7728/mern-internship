import User, { ROLES } from "../models/User.js";
import { asyncHandler, httpError, pick } from "../utils/helpers.js";

export const listUsers = asyncHandler(async (req, res) => {
  res.json({ users: await User.find().sort({ createdAt: -1 }) });
});

// Controlled workflow for creating recruiters/admins
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) throw httpError(400, "Name, email and password are required");
  if (password.length < 8) throw httpError(400, "Password must be at least 8 characters");
  if (!ROLES.includes(role)) throw httpError(400, "Invalid role");
  if (await User.exists({ email: email.toLowerCase() })) throw httpError(409, "Email already registered");

  const user = await User.create({ name, email, password, role });
  res.status(201).json({ user: user.toPublic() });
});

export const updateUser = asyncHandler(async (req, res) => {
  const data = pick(req.body, ["name", "role", "isActive"]);
  if (data.role && !ROLES.includes(data.role)) throw httpError(400, "Invalid role");

  const isSelf = req.params.id === req.user._id.toString();
  if (isSelf && (data.role !== undefined || data.isActive === false)) {
    throw httpError(400, "You cannot change your own role or deactivate yourself");
  }

  const user = await User.findById(req.params.id);
  if (!user) throw httpError(404, "User not found");
  Object.assign(user, data);
  await user.save();
  res.json({ user: user.toPublic() });
});

export const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) throw httpError(400, "You cannot delete yourself");
  const user = await User.findById(req.params.id);
  if (!user) throw httpError(404, "User not found");
  await user.deleteOne();
  res.json({ message: "User deleted" });
});