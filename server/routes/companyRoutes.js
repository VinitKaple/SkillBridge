import express from "express";
import { addCompany, getCompanies } from "../controllers/companyController.js";

const router = express.Router();

router.post("/add-company", addCompany);

router.get("/companies", getCompanies);

export default router;