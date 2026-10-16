import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Company name is required"], trim: true },
    description: { type: String, trim: true },
    website: { type: String, trim: true },
    location: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);