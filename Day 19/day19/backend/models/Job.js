const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true, maxlength: [100, "Title max 100 chars"] },
    company: { type: String, required: [true, "Company is required"], trim: true, maxlength: 100 },
    location: { type: String, required: [true, "Location is required"], trim: true },
    description: { type: String, required: [true, "Description is required"], maxlength: 5000 },
    salary: { type: Number, min: [0, "Salary cannot be negative"], default: 0 },
    experience: { type: Number, min: [0, "Experience min 0"], max: [30, "Experience max 30"], default: 0 },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

jobSchema.index({ createdAt: -1 });
jobSchema.index({ postedBy: 1, createdAt: -1 });
jobSchema.index({ location: 1 });

module.exports = mongoose.model("Job", jobSchema);
