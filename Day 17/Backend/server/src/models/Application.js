const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Interview", "Hired", "Rejected"],
      default: "Applied",
    },
  },
  { timestamps: true }
);

applicationSchema.index({ candidate: 1, job: 1 }, { unique: true }); // no duplicate applications

module.exports = mongoose.model("Application", applicationSchema);