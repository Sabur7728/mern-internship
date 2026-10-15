const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Company name is required"], trim: true },
    industry: { type: String, trim: true },
    location: { type: String, trim: true },
    website: { type: String, trim: true },
    size: { type: String, trim: true },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);