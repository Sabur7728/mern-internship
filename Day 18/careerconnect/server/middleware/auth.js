import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler, httpError } from "../utils/helpers.js";

// Authentication: who are you?  -> 401 on failure
export const authenticate = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) throw httpError(401, "Authentication required");

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw httpError(401, "Invalid or expired token");
  }

  // Role comes from the DATABASE, never from the browser
  const user = await User.findById(payload.sub);
  if (!user || !user.isActive) throw httpError(401, "User no longer valid");

  req.user = user;
  next();
});

// Authorization: what may you do?  -> 403 on failure
export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(httpError(403, "You do not have permission to perform this action"));
    }
    next();
  };