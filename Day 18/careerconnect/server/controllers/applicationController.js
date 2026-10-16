import Application, { APP_STATUSES } from "../models/Application.js";
import Job from "../models/Job.js";
import { asyncHandler, httpError } from "../utils/helpers.js";

export const applyToJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.body.jobId);
  if (!job) throw httpError(404, "Job not found");
  if (job.status !== "open") throw httpError(400, "This job is closed");

  const exists = await Application.exists({ job: job._id, candidate: req.user._id });
  if (exists) throw httpError(409, "You already applied to this job");

  const application = await Application.create({
    job: job._id,
    candidate: req.user._id, // trusted identity
    coverLetter: req.body.coverLetter,
  });
  res.status(201).json({ application });
});

export const myApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ candidate: req.user._id })
    .populate({ path: "job", select: "title location type company", populate: { path: "company", select: "name" } })
    .sort({ createdAt: -1 });
  res.json({ applications });
});

// Recruiter -> applications to own jobs, Admin -> all
export const managedApplications = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.user.role !== "admin") {
    const ids = await Job.find({ postedBy: req.user._id }).distinct("_id");
    filter = { job: { $in: ids } };
  }
  const applications = await Application.find(filter)
    .populate("job", "title location")
    .populate("candidate", "name email phone location")
    .sort({ createdAt: -1 });
  res.json({ applications });
});

export const getApplication = asyncHandler(async (req, res) => {
  const app = await Application.findById(req.params.id)
    .populate("job", "title location postedBy")
    .populate("candidate", "name email phone location");
  if (!app) throw httpError(404, "Application not found");

  const u = req.user;
  const isOwnerCandidate = app.candidate._id.toString() === u._id.toString();
  const isJobRecruiter = app.job.postedBy.toString() === u._id.toString();
  if (!(u.role === "admin" || isOwnerCandidate || isJobRecruiter)) {
    throw httpError(403, "You cannot access this application");
  }
  res.json({ application: app });
});

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!APP_STATUSES.includes(status)) throw httpError(400, "Invalid status");

  const app = await Application.findById(req.params.id).populate("job", "postedBy");
  if (!app) throw httpError(404, "Application not found");

  const owns = app.job.postedBy.toString() === req.user._id.toString();
  if (req.user.role !== "admin" && !owns) throw httpError(403, "You cannot manage this application");

  app.status = status;
  await app.save();
  res.json({ application: app });
});