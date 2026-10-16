import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    description: { type: String, required: [true, "Description is required"] },
    location: { type: String, trim: true },
    salary: { type: Number, min: 0 },
    type: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship"],
      default: "full-time",
    },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);