import Job from "../models/Job.js";
import Candidate from "../models/Candidate.js";
import Application from "../models/Application.js";

export const getDashboardStats = async ({ userId, role }) => {
  // Admin sab jobs dekhta hai, recruiter sirf apni
  const jobFilter = role === "admin" ? {} : { recruiterId: userId };
  const myJobs = await Job.find(jobFilter).select("_id status");
  const jobIds = myJobs.map((j) => j._id);

  const appFilter = { jobId: { $in: jobIds } };

  const [totalCandidates, totalApplications, interviews, hired, recent] =
    await Promise.all([
      Candidate.countDocuments(),
      Application.countDocuments(appFilter),
      Application.countDocuments({ ...appFilter, status: "Interview" }),
      Application.countDocuments({ ...appFilter, status: "Hired" }),
      Application.find(appFilter)
        .populate("jobId", "title")
        .populate("candidateId", "name")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

  return {
    totalJobs: myJobs.length,
    openJobs: myJobs.filter((j) => j.status !== "Closed").length,
    totalCandidates,
    totalApplications,
    interviews,
    hired,
    recent,
  };
};