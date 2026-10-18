import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Candidate from '../models/Candidate.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { signToken } from '../utils/token.js';
import { validateRegister } from '../validators/index.js';

export const register = asyncHandler(async (req, res) => {
  const errors = validateRegister(req.body);
  if (errors.length) throw new ApiError(400, 'Validation failed', errors);

  const { name, email, password, role = 'candidate' } = req.body;
  if (await User.findOne({ email: String(email).toLowerCase() })) throw new ApiError(409, 'Email is already registered');

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role });
  if (role === 'candidate') await Candidate.create({ user: user._id, name: user.name, email: user.email });

  res.status(201).json({ success: true, token: signToken(user), user });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, 'Email and password are required');

  const user = await User.findOne({ email: String(email).toLowerCase() }).select('+passwordHash');
  // same message for unknown user / wrong password (prevents user enumeration)
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw new ApiError(401, 'Invalid email or password');
  if (user.status !== 'active') throw new ApiError(403, 'Your account has been suspended');

  res.json({ success: true, token: signToken(user), user });
});

export const me = asyncHandler(async (req, res) => res.json({ success: true, user: req.user }));

// JWT is stateless: the client discards the token. Endpoint exists for symmetry/auditing.
export const logout = (_req, res) => res.json({ success: true, message: 'Logged out' });
