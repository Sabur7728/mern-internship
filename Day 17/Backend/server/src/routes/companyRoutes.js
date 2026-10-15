const router = require("express").Router();
const Company = require("../models/Company");
const crud = require("../utils/crudFactory");
const { protect, authorize } = require("../middleware/auth");
const validateId = require("../middleware/validateId");

const c = crud(Company, {
  allowedFields: ["name", "industry", "location", "website", "size", "description", "isActive"],
  searchFields: ["name", "industry", "location"],
  filterFields: ["industry", "location", "isActive"],
  sortable: ["createdAt", "name"],
});

router.use(protect);
router.get("/", c.list);
router.get("/:id", validateId, c.getOne);
router.post("/", authorize("admin"), c.create);
router.patch("/:id", authorize("admin"), validateId, c.update);
router.delete("/:id", authorize("admin"), validateId, c.remove);

module.exports = router;