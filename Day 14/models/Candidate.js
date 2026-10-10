import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"]
    },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    experience: { type: Number, required: true, min: 0, max: 50 },
    currentPosition: { type: String, trim: true },
    skills: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Interview", "Hired", "Rejected"],
      default: "Applied"
    },
    appliedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Candidate = mongoose.model("Candidate", candidateSchema);
export default Candidate;