import Job from "../models/Job.js";
import Application from "../models/Application.js";
import Company from "../models/Company.js";
import { asyncHandler, httpError, pick } from "../utils/helpers.js";

const FIELDS = ["title", "description", "location", "salary", "type", "company", "status"];

// Ownership rule: admin OR the recruiter who posted it
const canManage = (job, user) =>
  user.role === "admin" || job.postedBy.toString() === user._id.toString();

const populate = (q) => q.populate("company", "name location").populate("postedBy", "name email");

export const getJobs = asyncHandler(async (req, res) => {
  const jobs = await populate(Job.find().sort({ createdAt: -1 }));
  res.json({ jobs });
});

// Recruiter -> own jobs, Admin -> all jobs
export const getManagedJobs = asyncHandler(async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { postedBy: req.user._id };
  const jobs = await populate(Job.find(filter).sort({ createdAt: -1 }));
  res.json({ jobs });
});

export const getJob = asyncHandler(async (req, res) => {
  const job = await populate(Job.findById(req.params.id));
  if (!job) throw httpError(404, "Job not found");
  res.json({ job });
});

export const createJob = asyncHandler(async (req, res) => {
  const data = pick(req.body, FIELDS);
  if (data.company && !(await Company.exists({ _id: data.company }))) {
    throw httpError(400, "Company does not exist");
  }
  if (!data.company) delete data.company;
  const job = await Job.create({ ...data, postedBy: req.user._id }); // trusted owner
  res.status(201).json({ job });
});

export const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw httpError(404, "Job not found");
  if (!canManage(job, req.user)) throw httpError(403, "You do not own this job");

  const data = pick(req.body, FIELDS);
  if (!data.company) delete data.company;
  Object.assign(job, data);
  await job.save();
  res.json({ job });
});

export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw httpError(404, "Job not found");
  if (!canManage(job, req.user)) throw httpError(403, "You do not own this job");

  await Application.deleteMany({ job: job._id });
  await job.deleteOne();
  res.json({ message: "Job deleted" });
});