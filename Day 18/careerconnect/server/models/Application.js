import mongoose from "mongoose";

export const APP_STATUSES = ["pending", "reviewed", "shortlisted", "rejected", "hired"];

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    coverLetter: { type: String, trim: true },
    status: { type: String, enum: APP_STATUSES, default: "pending" },
  },
  { timestamps: true }
);

// One application per candidate per job
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);