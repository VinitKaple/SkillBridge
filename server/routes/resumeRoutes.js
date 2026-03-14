import express from "express";
import multer from "multer";
import { analyzeResume } from "../controllers/resumeController.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/analyze-resume", upload.single("file"), analyzeResume);

export default router;