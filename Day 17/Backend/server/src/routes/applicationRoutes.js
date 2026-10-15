const router = require("express").Router();
const ctrl = require("../controllers/applicationController");
const { protect, authorize } = require("../middleware/auth");
const validateId = require("../middleware/validateId");

router.use(protect);
router.get("/", ctrl.list);
router.post("/", authorize("candidate"), ctrl.apply);
router.patch("/:id", authorize("recruiter", "admin"), validateId, ctrl.updateStatus);
router.delete("/:id", authorize("recruiter", "admin"), validateId, ctrl.remove);

module.exports = router;