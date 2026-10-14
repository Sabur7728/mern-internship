import Application from "../models/Application.js";
import Job from "../models/Job.js";

// POST /api/applications  (candidate)
export const createApplication = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    if (!jobId) {
      return res.status(400).json({ success: false, message: "jobId is required" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const exists = await Application.findOne({
      jobId,
      candidateId: req.user.userId,
    });
    if (exists) {
      return res
        .status(409)
        .json({ success: false, message: "You have already applied for this job" });
    }

    const application = await Application.create({
      jobId,
      coverLetter,
      candidateId: req.user.userId, // token se, body se nahi
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/applications
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
    // admin: empty filter => sab applications

    const applications = await Application.find(filter)
      .populate("jobId", "title company location")
      .populate("candidateId", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/applications/:id  (recruiter/admin)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["Applied", "Shortlisted", "Interview", "Hired", "Rejected"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    // Recruiter sirf apni job ki application badal sakta hai
    const job = await Job.findById(application.jobId);
    const isOwner = job && String(job.recruiterId) === String(req.user.userId);

    if (req.user.role !== "admin" && !isOwner) {
      return res
        .status(403)
        .json({ success: false, message: "You do not have permission to do this" });
    }

    application.status = status;
    await application.save();

    res.json({ success: true, data: application });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};