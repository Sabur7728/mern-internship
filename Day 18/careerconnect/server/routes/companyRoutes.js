import { Router } from "express";
import {
  getCompanies, createCompany, updateCompany, deleteCompany,
} from "../controllers/companyController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();
router.use(authenticate);

router.get("/", getCompanies);
router.post("/", authorize("admin"), createCompany);
router.put("/:id", authorize("admin"), updateCompany);
router.delete("/:id", authorize("admin"), deleteCompany);
export default router;