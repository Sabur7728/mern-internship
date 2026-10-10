import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },
    location: { type: String, required: true, trim: true },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      default: "Full-time"
    },
    experienceMin: { type: Number, min: 0, default: 0 },
    experienceMax: { type: Number, min: 0 },
    salaryMin: { type: Number, min: 0 },
    salaryMax: { type: Number, min: 0 },
    skills: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["Open", "Closed", "Draft"],
      default: "Open"
    }
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
export default Job;