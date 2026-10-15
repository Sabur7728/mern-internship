const Application = require("../models/Application");
const Job = require("../models/Job");
const Candidate = require("../models/Candidate");

const httpError = (s, m) => Object.assign(new Error(m), { statusCode: s });

exports.apply = async (req, res, next) => {
  try {
    const candidate = await Candidate.findOne({ user: req.user._id });
    if (!candidate) throw httpError(400, "Create your candidate profile first (My Profile)");
    const job = await Job.findById(req.body.job);
    if (!job) throw httpError(404, "Job not found");
    if (job.status !== "Open") throw httpError(400, "This job is not open for applications");

    const app = await Application.create({ candidate: candidate._id, job: job._id });
    res.status(201).json({ success: true, data: app });
  } catch (e) {
    if (e.code === 11000) e = httpError(409, "You have already applied to this job");
    next(e);
  }
};

exports.list = async (req, res, next) => {
  try {
    let filter = {};
    if (req.user.role === "candidate") {
      const c = await Candidate.findOne({ user: req.user._id });
      filter.candidate = c ? c._id : null;
    } else if (req.user.role === "recruiter") {
      const myJobs = await Job.find({ createdBy: req.user._id }).select("_id");
      filter.job = { $in: myJobs.map((j) => j._id) };
    }
    if (req.query.status) filter.status = req.query.status;

    const data = await Application.find(filter)
      .populate("candidate", "name email location experience currentPosition skills")
      .populate("job", "title location")
      .sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (e) { next(e); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const app = await Application.findById(req.params.id).populate("job");
    if (!app) throw httpError(404, "Application not found");

    const owns = app.job && String(app.job.createdBy) === String(req.user._id);
    if (req.user.role !== "admin" && !owns) throw httpError(403, "Not allowed to update this application");

    app.status = req.body.status;
    await app.save();
    await app.populate("candidate", "name email");
    res.json({ success: true, data: app });
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const app = await Application.findById(req.params.id).populate("job");
    if (!app) throw httpError(404, "Application not found");
    if (req.user.role !== "admin" && String(app.job?.createdBy) !== String(req.user._id))
      throw httpError(403, "Not allowed");
    await app.deleteOne();
    res.json({ success: true, id: req.params.id });
  } catch (e) { next(e); }
};