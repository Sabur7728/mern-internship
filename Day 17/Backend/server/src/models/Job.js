const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Job title is required"], trim: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    location: { type: String, required: [true, "Location is required"], trim: true },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      default: "Full-time",
    },
    experienceMin: { type: Number, min: [0, "Cannot be negative"], default: 0 },
    experienceMax: {
      type: Number,
      min: [0, "Cannot be negative"],
      default: 0,
      validate: {
        validator(v) { return v >= this.experienceMin; },
        message: "Max experience cannot be less than min experience",
      },
    },
    salaryMin: { type: Number, min: 0 },
    salaryMax: { type: Number, min: 0 },
    skills: [{ type: String, trim: true }],
    status: { type: String, enum: ["Open", "Closed", "Draft"], default: "Open" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", location: "text", skills: "text" });

module.exports = mongoose.model("Job", jobSchema);