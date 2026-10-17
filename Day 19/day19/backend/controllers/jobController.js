const Job = require("../models/Job");

const httpError = (statusCode, message) => Object.assign(new Error(message), { statusCode });
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const pick = (obj, keys) => keys.reduce((a, k) => (obj[k] !== undefined ? { ...a, [k]: obj[k] } : a), {});
const FIELDS = ["title", "company", "location", "description", "salary", "experience"];

const canModify = (job, user) =>
  job.postedBy.toString() === user._id.toString() || user.role === "admin";

// GET /api/jobs?search=&location=&page=1&limit=10
exports.getJobs = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);

    const filter = {};
    if (req.query.search) {
      const rx = new RegExp(escapeRegex(String(req.query.search).trim()), "i");
      filter.$or = [{ title: rx }, { company: rx }];
    }
    if (req.query.location) {
      filter.location = new RegExp(`^${escapeRegex(String(req.query.location).trim())}$`, "i");
    }

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .select("title company location salary experience createdAt")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Job.countDocuments(filter),
    ]);

    res.json({ data: jobs, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
};

exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "name").lean();
    if (!job) throw httpError(404, "Job not found");
    res.json(job);
  } catch (err) { next(err); }
};

exports.createJob = async (req, res, next) => {
  try {
    const job = await Job.create({ ...pick(req.body, FIELDS), postedBy: req.user._id });
    res.status(201).json(job);
  } catch (err) { next(err); }
};

exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) throw httpError(404, "Job not found");
    if (!canModify(job, req.user)) throw httpError(403, "You can only modify your own jobs");
    job.set(pick(req.body, FIELDS));
    await job.save();
    res.json(job);
  } catch (err) { next(err); }
};

exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) throw httpError(404, "Job not found");
    if (!canModify(job, req.user)) throw httpError(403, "You can only modify your own jobs");
    await job.deleteOne();
    res.json({ message: "Job deleted" });
  } catch (err) { next(err); }
};
