import Application from "../models/Application.js";
import Job from "../models/Job.js";

export const createApplication = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    if (!jobId)
      return res.status(400).json({ success: false, message: "jobId is required" });

    const job = await Job.findById(jobId);
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    const application = await Application.create({
      jobId,
      coverLetter,
      candidateId: req.user.userId // from the token, never from req.body
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getApplications = async (req, res) => {
  try {
    const { userId, role } = req.user;
    let filter = {};

    if (role === "candidate") {
      filter = { candidateId: userId };
    } else if (role === "recruiter") {
      const myJobs = await Job.find({ recruiterId: userId }).select("_id");
      filter = { jobId: { $in: myJobs.map((j) => j._id) } };
    }
    // admin: empty filter returns all

    const applications = await Application.find(filter);
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};