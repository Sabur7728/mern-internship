const router = require("express").Router();
const { getJobs, getJob, createJob, updateJob, deleteJob } = require("../controllers/jobController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", getJobs);
router.get("/:id", getJob);
router.post("/", protect, authorize("recruiter", "admin"), createJob);
router.put("/:id", protect, authorize("recruiter", "admin"), updateJob);
router.delete("/:id", protect, authorize("recruiter", "admin"), deleteJob);

module.exports = router;
