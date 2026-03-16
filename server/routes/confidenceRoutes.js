// server/routes/confidenceRoutes.js
// ConfidenceLens AI – Express routes
// Register in server.js as: app.use("/api/confidence", confidenceRoutes)

import express from "express";
import multer from "multer";
import {
  analyzeConfidence,
  getReportBySession,
  getUserHistory,
} from "../controllers/confidenceController.js";

const router = express.Router();

/**
 * Multer config: store audio in memory (buffer), max 50MB
 * We use memoryStorage so we can pass the buffer directly to OpenAI Whisper
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (req, file, cb) => {
    // Accept audio files only
    if (
      file.mimetype.startsWith("audio/") ||
      file.mimetype === "video/webm" // Some browsers send webm for audio
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only audio files are allowed"), false);
    }
  },
});

// ─── Routes ──────────────────────────────────────────────────────────────────

// POST /api/confidence/analyze
// Main analysis endpoint — accepts audio + face data
router.post("/analyze", upload.single("audio"), analyzeConfidence);

// GET /api/confidence/report/:sessionId
// Retrieve a single completed report
router.get("/report/:sessionId", getReportBySession);

// GET /api/confidence/history/:userId
// Get user's past confidence reports
router.get("/history/:userId", getUserHistory);

// Error handling middleware for multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
});

export default router;