import mongoose from "mongoose";
import Job from "../models/Job.js";
import Company from "../models/Company.js";
import asyncHandler from "../utils/asyncHandler.js";

const invalidId = (res) =>
  res.status(400).json({ success: false, message: "Invalid job ID" });

export const createJob = asyncHandler(async (req, res) => {
  const { companyId } = req.body;

  // Debugging exercise: valid ObjectId ka matlab ye nahi ki company exist karti hai
  if (!mongoose.isValidObjectId(companyId)) {
    return res.status(400).json({ success: false, message: "Invalid company ID" });
  }
  const company = await Company.findById(companyId);
  if (!company) {
    return res.status(404).json({ success: false, message: "Company does not exist" });
  }

  const job = await Job.create(req.body);
  res.status(201).json({ success: true, data: job });
});

export const listJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find()
    .populate("companyId", "name industry location")
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: jobs });
});

export const getJobById = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return invalidId(res);

  const job = await Job.findById(req.params.id).populate(
    "companyId",
    "name industry location"
  );
  if (!job) {
    return res.status(404).json({ success: false, message: "Job not found" });
  }
  res.status(200).json({ success: true, data: job });
});

export const updateJob = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return invalidId(res);

  // Agar companyId change ho rahi hai to usse bhi check karo
  if (req.body.companyId) {
    if (!mongoose.isValidObjectId(req.body.companyId)) {
      return res.status(400).json({ success: false, message: "Invalid company ID" });
    }
    const company = await Company.findById(req.body.companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: "Company does not exist" });
    }
  }

  const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!job) {
    return res.status(404).json({ success: false, message: "Job not found" });
  }
  res.status(200).json({ success: true, data: job });
});

export const deleteJob = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return invalidId(res);

  const job = await Job.findByIdAndDelete(req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, message: "Job not found" });
  }
  res.status(200).json({ success: true, message: "Job deleted" });
});