import mongoose from "mongoose";
import Company from "../models/Company.js";
import asyncHandler from "../utils/asyncHandler.js";

const invalidId = (res) =>
  res.status(400).json({ success: false, message: "Invalid company ID" });

export const createCompany = asyncHandler(async (req, res) => {
  const company = await Company.create(req.body);
  res.status(201).json({ success: true, data: company });
});

export const listCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: companies });
});

export const getCompanyById = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return invalidId(res);

  const company = await Company.findById(req.params.id);
  if (!company) {
    return res.status(404).json({ success: false, message: "Company not found" });
  }
  res.status(200).json({ success: true, data: company });
});

export const updateCompany = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return invalidId(res);

  const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!company) {
    return res.status(404).json({ success: false, message: "Company not found" });
  }
  res.status(200).json({ success: true, data: company });
});

export const deleteCompany = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return invalidId(res);

  const company = await Company.findByIdAndDelete(req.params.id);
  if (!company) {
    return res.status(404).json({ success: false, message: "Company not found" });
  }
  res.status(200).json({ success: true, message: "Company deleted" });
});