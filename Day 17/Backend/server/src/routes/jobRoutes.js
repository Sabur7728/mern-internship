const router = require("express").Router();
const Job = require("../models/Job");
const crud = require("../utils/crudFactory");
const { protect, authorize } = require("../middleware/auth");
const validateId = require("../middleware/validateId");

const c = crud(Job, {
  allowedFields: ["title", "company", "location", "employmentType", "experienceMin",
                  "experienceMax", "salaryMin", "salaryMax", "skills", "status"],
  searchFields: ["title", "location", "skills"],
  filterFields: ["status", "location", "employmentType", "company"],
  sortable: ["createdAt", "title", "salaryMin"],
  populate: "company",
});

router.use(protect);
router.get("/", c.list);
router.get("/:id", validateId, c.getOne);
router.post("/", authorize("recruiter", "admin"), c.create);
router.patch("/:id", authorize("recruiter", "admin"), validateId, c.update);
router.delete("/:id", authorize("recruiter", "admin"), validateId, c.remove);

module.exports = router;