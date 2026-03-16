// server/models/confidenceModel.js
// ConfidenceLens AI – MongoDB schema for storing analysis reports

import mongoose from "mongoose";

/**
 * Schema for individual analysis breakdown scores
 */
const ScoreBreakdownSchema = new mongoose.Schema(
  {
    eyeContact: { type: Number, min: 0, max: 10, default: 0 },
    faceDirection: { type: Number, min: 0, max: 10, default: 0 },
    handMovement: { type: Number, min: 0, max: 10, default: 0 },
    facialEmotion: { type: Number, min: 0, max: 10, default: 0 },
    voiceClarity: { type: Number, min: 0, max: 10, default: 0 },
    speechSpeed: { type: Number, min: 0, max: 10, default: 0 },
    fillerWords: { type: Number, min: 0, max: 10, default: 0 },
    communication: { type: Number, min: 0, max: 10, default: 0 },
    emotionStability: { type: Number, min: 0, max: 10, default: 0 },
    bodyLanguage: { type: Number, min: 0, max: 10, default: 0 },
  },
  { _id: false }
);

/**
 * Main ConfidenceReport schema
 */
const ConfidenceReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Allow anonymous sessions during MVP
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    scenario: {
      type: String,
      required: true,
      enum: [
        "hackathon_pitch",
        "interview_answer",
        "leadership_speech",
        "self_introduction",
        "public_speaking",
      ],
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    breakdown: {
      type: ScoreBreakdownSchema,
      required: true,
    },
    transcript: {
      type: String,
      default: "",
      maxlength: 5000,
    },
    fillerWordCount: {
      type: Number,
      default: 0,
    },
    fillerWordsList: {
      type: [String],
      default: [],
    },
    speakingDurationSeconds: {
      type: Number,
      default: 0,
    },
    dominantEmotion: {
      type: String,
      default: "neutral",
    },
    aiFeedback: {
      type: [String],
      default: [],
    },
    rawAnalysis: {
      type: mongoose.Schema.Types.Mixed, // Store full OpenAI/HuggingFace response
      default: {},
    },
    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Index for fetching user's report history efficiently
ConfidenceReportSchema.index({ userId: 1, createdAt: -1 });
// Note: sessionId index is declared inline above via `index: true` — no duplicate needed

export default mongoose.model("ConfidenceReport", ConfidenceReportSchema);