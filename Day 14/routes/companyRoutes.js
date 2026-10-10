import express from "express";
import {
  createCompany,
  listCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany
} from "../controllers/companyController.js";

const router = express.Router();

router.route("/").post(createCompany).get(listCompanies);
router
  .route("/:id")
  .get(getCompanyById)
  .patch(updateCompany)
  .delete(deleteCompany);

export default router;