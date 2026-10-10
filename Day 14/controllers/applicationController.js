import mongoose from "mongoose";
import Application from "../models/Application.js";
import Candidate from "../models/Candidate.js";
import Job from "../models/Job.js";
import asyncHandler from "../utils/asyncHandler.js";

const invalidId = (res) =>
  res.status(400).json({ success: false, message: "Invalid application ID" });

export const createApplication = asyncHandler(async (req, res) => {
  const { candidateId, jobId } = req.body;

  if (!mongoose.isValidObjectId(candidateId) || !mongoose.isValidObjectId(jobId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid candidateId or jobId" });
  }

  const [candidate, job] = await Promise.all([
    Candidate.findById(candidateId),
    Job.findById(jobId)
  ]);

  if (!candidate) {
    return res.status(404).json({ success: false, message: "Candidate does not exist" });
  }
  if (!job) {
    return res.status(404).json({ success: false, message: "Job does not exist" });
  }

  const application = await Application.create({
    candidateId,
    jobId,
    status: req.body.status
  });
  res.status(201).json({ success: true, data: application });
});

export const listApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find()
    .populate("candidateId", "name email")
    .populate("jobId", "title location")
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: applications });
});

export const getApplicationById = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return invalidId(res);

  const application = await Application.findById(req.params.id)
    .populate("candidateId", "name email")
    .populate("jobId", "title location");

  if (!application) {
    return res.status(404).json({ success: false, message: "Application not found" });
  }
  res.status(200).json({ success: true, data: application });
});

export const updateApplication = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return invalidId(res);

  // Application mein sirf status update hona chahiye
  const application = await Application.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!application) {
    return res.status(404).json({ success: false, message: "Application not found" });
  }
  res.status(200).json({ success: true, data: application });
});

export const deleteApplication = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return invalidId(res);

  const application = await Application.findByIdAndDelete(req.params.id);
  if (!application) {
    return res.status(404).json({ success: false, message: "Application not found" });
  }
  res.status(200).json({ success: true, message: "Application deleted" });
});