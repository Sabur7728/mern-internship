const router = require("express").Router();
const Candidate = require("../models/Candidate");
const crud = require("../utils/crudFactory");
const { protect, authorize } = require("../middleware/auth");
const validateId = require("../middleware/validateId");

const c = crud(Candidate, {
  allowedFields: ["name", "email", "phone", "location", "experience",
                  "currentPosition", "skills", "status"],
  searchFields: ["name", "email", "location", "currentPosition", "skills"],
  filterFields: ["status", "location"],
  sortable: ["createdAt", "name", "experience"],
  recruiterCanUpdate: true, // recruiter status update kar sake

  beforeCreate: async (body, req) => {
    if (req.user.role === "candidate") {
      const exists = await Candidate.exists({ user: req.user._id });
      if (exists) throw Object.assign(new Error("You already have a profile"), { statusCode: 409 });
      body.user = req.user._id;   // account se link (apply ke liye zaroori)
      delete body.status;         // candidate apna status khud set nahi kar sakta
    }
  },
  beforeUpdate: (body, req) => {
    if (req.user.role === "candidate") delete body.status;
  },
});

// Candidate sirf apni profile access kare
const ownOrStaff = async (req, res, next) => {
  try {
    if (req.user.role !== "candidate") return next();
    const mine = await Candidate.findOne({ user: req.user._id }).select("_id");
    if (!mine || String(mine._id) !== req.params.id) {
      return res.status(403).json({ success: false, message: "You can only access your own profile" });
    }
    next();
  } catch (e) { next(e); }
};

router.use(protect);
router.get("/", authorize("recruiter", "admin"), c.list);
router.get("/me", async (req, res, next) => {          // /:id se PEHLE
  try {
    const doc = await Candidate.findOne({ user: req.user._id });
    res.json({ success: true, data: doc });
  } catch (e) { next(e); }
});
router.get("/:id", validateId, ownOrStaff, c.getOne);
router.post("/", c.create);
router.patch("/:id", validateId, ownOrStaff, c.update);
router.delete("/:id", validateId, ownOrStaff, c.remove);

module.exports = router;