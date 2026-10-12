import Job from "../models/Job.js";

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "Open" });
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const { recruiterId, ...data } = req.body; // discard any client-sent owner
    const job = await Job.create({ ...data, recruiterId: req.user.userId });
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    const isOwner = job.recruiterId?.toString() === req.user.userId;
    if (!isOwner && req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Not your job" });

    const { recruiterId, ...data } = req.body;
    Object.assign(job, data);
    await job.save();
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    const isOwner = job.recruiterId?.toString() === req.user.userId;
    if (!isOwner && req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Not your job" });

    await job.deleteOne();
    res.json({ success: true, message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};