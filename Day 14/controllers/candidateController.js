import mongoose from "mongoose";
import Candidate from "../models/Candidate.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getCandidates } from "../services/candidateService.js";

// POST /api/candidates
export const createCandidate = asyncHandler(async (req, res) => {
  const candidate = await Candidate.create(req.body);
  res.status(201).json({ success: true, data: candidate });
});

// GET /api/candidates
export const listCandidates = asyncHandler(async (req, res) => {
  const result = await getCandidates(req.query);
  res.status(200).json({ success: true, ...result });
});

// GET /api/candidates/:id
export const getCandidateById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid candidate ID" });
  }

  const candidate = await Candidate.findById(id);
  if (!candidate) {
    return res.status(404).json({ success: false, message: "Candidate not found" });
  }

  res.status(200).json({ success: true, data: candidate });
});

// PATCH /api/candidates/:id
export const updateCandidate = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid candidate ID" });
  }

  // Sirf allowed fields update honge
  const allowed = ["status", "location", "experience", "currentPosition", "skills"];
  const updates = {};
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const candidate = await Candidate.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true
  });

  if (!candidate) {
    return res.status(404).json({ success: false, message: "Candidate not found" });
  }

  res.status(200).json({ success: true, data: candidate });
});

// DELETE /api/candidates/:id
export const deleteCandidate = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid candidate ID" });
  }

  const candidate = await Candidate.findByIdAndDelete(id);
  if (!candidate) {
    return res.status(404).json({ success: false, message: "Candidate not found" });
  }

  res.status(200).json({ success: true, message: "Candidate deleted" });
});