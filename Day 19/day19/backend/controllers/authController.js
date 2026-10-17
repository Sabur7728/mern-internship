const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
const httpError = (statusCode, message) => Object.assign(new Error(message), { statusCode });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) throw httpError(400, "Name, email and password are required");

    const safeRole = role === "recruiter" ? "recruiter" : "candidate"; // never admin

    if (await User.findOne({ email: String(email).toLowerCase() })) {
      throw httpError(409, "Email already registered");
    }
    const user = await User.create({ name, email, password, role: safeRole });
    res.status(201).json({
      token: signToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw httpError(400, "Email and password are required");

    const user = await User.findOne({ email: String(email).toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      throw httpError(401, "Invalid email or password");
    }
    res.json({
      token: signToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) { next(err); }
};

exports.me = (req, res) => res.json({ user: req.user });
