// server/controllers/confidenceController.js
// ConfidenceLens AI – Express controller

import { v4 as uuidv4 } from "uuid";
import ConfidenceReport from "../models/confidenceModel.js";
import { runFullAnalysis } from "../services/confidenceService.js";

/**
 * POST /api/confidence/analyze
 * Accepts: multipart/form-data with fields:
 *   - audio (file) : recorded audio blob
 *   - faceData (string) : JSON of face analysis from frontend
 *   - scenario (string) : e.g. "interview_answer"
 *   - duration (string) : recording duration in seconds
 *   - userId (string, optional)
 */
const analyzeConfidence = async (req, res) => {
  try {
    const { scenario, duration, userId, faceData: faceDataStr } = req.body;

    // Validate required fields
    if (!scenario) {
      return res.status(400).json({
        success: false,
        message: "Scenario is required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Audio file is required.",
      });
    }

    // Parse face data from frontend (stringified JSON)
    let faceData = {};
    try {
      faceData = faceDataStr ? JSON.parse(faceDataStr) : {};
    } catch {
      console.warn("[confidenceController] Could not parse faceData JSON");
    }

    const durationSeconds = parseFloat(duration) || 30;
    const sessionId = uuidv4();

    // Create a 'processing' record immediately so frontend can poll
    const report = new ConfidenceReport({
      userId: userId || undefined,
      sessionId,
      scenario,
      confidenceScore: 0,
      breakdown: {},
      status: "processing",
    });
    await report.save();

    // Run full AI analysis pipeline (async — don't block response)
    // We run it inline here for simplicity; for large scale, use a queue
    const audioBuffer = req.file.buffer;
    const mimeType = req.file.mimetype || "audio/webm";

    try {
      const result = await runFullAnalysis({
        audioBuffer,
        mimeType,
        faceData,
        scenario,
        durationSeconds,
      });

      // Update the report with results
      await ConfidenceReport.findOneAndUpdate(
        { sessionId },
        {
          confidenceScore: result.confidenceScore,
          breakdown: result.breakdown,
          transcript: result.transcript,
          fillerWordCount: result.fillerWordCount,
          fillerWordsList: result.fillerWordsList,
          speakingDurationSeconds: result.speakingDurationSeconds,
          dominantEmotion: result.dominantEmotion,
          aiFeedback: result.aiFeedback,
          rawAnalysis: result.rawAnalysis,
          status: "completed",
        },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        sessionId,
        data: {
          confidenceScore: result.confidenceScore,
          breakdown: result.breakdown,
          transcript: result.transcript,
          fillerWordCount: result.fillerWordCount,
          fillerWordsList: result.fillerWordsList,
          speakingDurationSeconds: result.speakingDurationSeconds,
          dominantEmotion: result.dominantEmotion,
          aiFeedback: result.aiFeedback,
          summary: result.rawAnalysis?.gpt?.summary || "",
          speechSpeedWpm: result.rawAnalysis?.speechSpeedWpm || 0,
        },
      });
    } catch (analysisError) {
      console.error(
        "[confidenceController] Analysis pipeline failed:",
        analysisError.message
      );

      await ConfidenceReport.findOneAndUpdate(
        { sessionId },
        { status: "failed" }
      );

      return res.status(500).json({
        success: false,
        message: "AI analysis failed. Please try again.",
        sessionId,
      });
    }
  } catch (err) {
    console.error("[confidenceController] analyzeConfidence error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

/**
 * GET /api/confidence/report/:sessionId
 * Fetch a specific report by session ID
 */
const getReportBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const report = await ConfidenceReport.findOne({ sessionId }).lean();

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }

    return res.status(200).json({ success: true, data: report });
  } catch (err) {
    console.error("[confidenceController] getReportBySession error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

/**
 * GET /api/confidence/history/:userId
 * Fetch report history for a user (last 20 reports)
 */
const getUserHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const reports = await ConfidenceReport.find({
      userId,
      status: "completed",
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .select(
        "scenario confidenceScore breakdown dominantEmotion speakingDurationSeconds createdAt sessionId"
      )
      .lean();

    return res.status(200).json({ success: true, data: reports });
  } catch (err) {
    console.error("[confidenceController] getUserHistory error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export { analyzeConfidence, getReportBySession, getUserHistory };