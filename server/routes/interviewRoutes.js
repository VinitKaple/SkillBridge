import express from "express";
import {
  startInterview,
  nextQuestion,
  evaluate,
  getCompanies,
} from "../controllers/interviewController.js";

const router = express.Router();

// GET /api/interview/companies
router.get("/companies", getCompanies);

// POST /api/interview/start
router.post("/start", startInterview);

// POST /api/interview/next-question
router.post("/next-question", nextQuestion);

// POST /api/interview/evaluate
router.post("/evaluate", evaluate);

export default router;