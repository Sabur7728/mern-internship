import Company from "../models/Company.js";
import Job from "../models/Job.js";
import { asyncHandler, httpError, pick } from "../utils/helpers.js";

const FIELDS = ["name", "description", "website", "location"];

export const getCompanies = asyncHandler(async (req, res) => {
  res.json({ companies: await Company.find().sort({ name: 1 }) });
});

export const createCompany = asyncHandler(async (req, res) => {
  const company = await Company.create({ ...pick(req.body, FIELDS), createdBy: req.user._id });
  res.status(201).json({ company });
});

export const updateCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) throw httpError(404, "Company not found");
  Object.assign(company, pick(req.body, FIELDS));
  await company.save();
  res.json({ company });
});

export const deleteCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) throw httpError(404, "Company not found");
  if (await Job.exists({ company: company._id })) {
    throw httpError(400, "Cannot delete a company that still has jobs");
  }
  await company.deleteOne();
  res.json({ message: "Company deleted" });
});