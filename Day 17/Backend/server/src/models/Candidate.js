const mongoose = require("mongoose");

const STATUSES = ["Applied", "Shortlisted", "Interview", "Hired", "Rejected"];

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    experience: { type: Number, min: 0, default: 0 },
    currentPosition: { type: String, trim: true },
    skills: [{ type: String, trim: true }],
    status: { type: String, enum: STATUSES, default: "Applied" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // candidate's own account
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Candidate", candidateSchema);
module.exports.STATUSES = STATUSES;