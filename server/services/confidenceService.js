// server/services/confidenceService.js
// ConfidenceLens AI – Core AI processing service

import OpenAI from "openai";
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── OpenAI Client ────────────────────────────────────────────────────────────
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ─── HuggingFace Config ───────────────────────────────────────────────────────
const HF_API_URL =
  "https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base";
const HF_HEADERS = {
  Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
  "Content-Type": "application/json",
};

// Common filler words to detect
const FILLER_WORDS = [
  "um",
  "uh",
  "like",
  "you know",
  "so",
  "basically",
  "literally",
  "actually",
  "kind of",
  "sort of",
  "right",
  "okay",
  "well",
  "i mean",
  "you see",
  "hmm",
  "err",
];

/**
 * Transcribe audio using OpenAI Whisper
 * @param {Buffer} audioBuffer - Raw audio buffer
 * @param {string} mimeType - e.g. 'audio/webm'
 * @returns {string} transcript
 */
const transcribeAudio = async (audioBuffer, mimeType = "audio/webm") => {
  try {
    // Write buffer to a temp file (Whisper API needs a file-like object)
    const tmpDir = path.join(__dirname, "../tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const ext = mimeType.includes("webm") ? "webm" : "mp4";
    const tmpPath = path.join(tmpDir, `audio_${uuidv4()}.${ext}`);
    fs.writeFileSync(tmpPath, audioBuffer);

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tmpPath),
      model: "whisper-1",
      response_format: "text",
      language: "en",
    });

    // Cleanup temp file
    fs.unlinkSync(tmpPath);

    return typeof transcription === "string"
      ? transcription
      : transcription.text || "";
  } catch (err) {
    console.error("[confidenceService] transcribeAudio error:", err.message);
    return "";
  }
};

/**
 * Detect filler words in a transcript
 * @param {string} transcript
 * @returns {{ count: number, words: string[] }}
 */
const detectFillerWords = (transcript) => {
  if (!transcript) return { count: 0, words: [] };

  const lower = transcript.toLowerCase();
  const found = [];

  FILLER_WORDS.forEach((filler) => {
    // Match whole words/phrases
    const regex = new RegExp(`\\b${filler}\\b`, "gi");
    const matches = lower.match(regex);
    if (matches) {
      found.push(...matches.map(() => filler));
    }
  });

  return { count: found.length, words: [...new Set(found)] };
};

/**
 * Estimate speech speed (words per minute)
 * @param {string} transcript
 * @param {number} durationSeconds
 * @returns {number} wpm
 */
const calculateSpeechSpeed = (transcript, durationSeconds) => {
  if (!transcript || durationSeconds === 0) return 0;
  const wordCount = transcript.trim().split(/\s+/).length;
  return Math.round((wordCount / durationSeconds) * 60);
};

/**
 * Analyze emotion from transcript using HuggingFace
 * @param {string} transcript
 * @returns {{ dominant: string, scores: object }}
 */
const analyzeEmotion = async (transcript) => {
  if (!transcript || transcript.length < 10) {
    return { dominant: "neutral", scores: { neutral: 1.0 } };
  }

  try {
    const response = await axios.post(
      HF_API_URL,
      { inputs: transcript.substring(0, 512) }, // HF limit
      { headers: HF_HEADERS, timeout: 15000 }
    );

    const results = response.data;

    // HF returns array of [{label, score}]
    if (Array.isArray(results) && results.length > 0) {
      const labels = Array.isArray(results[0]) ? results[0] : results;
      const sorted = labels.sort((a, b) => b.score - a.score);
      const dominant = sorted[0]?.label?.toLowerCase() || "neutral";
      const scores = {};
      sorted.forEach((item) => {
        scores[item.label?.toLowerCase()] = parseFloat(
          item.score.toFixed(3)
        );
      });
      return { dominant, scores };
    }

    return { dominant: "neutral", scores: { neutral: 1.0 } };
  } catch (err) {
    console.error("[confidenceService] analyzeEmotion error:", err.message);
    return { dominant: "neutral", scores: { neutral: 1.0 } };
  }
};

/**
 * Generate AI communication analysis using GPT-4
 * @param {object} params - { transcript, scenario, fillerWordCount, speechSpeedWpm, dominantEmotion, durationSeconds }
 * @returns {{ scores: object, feedback: string[], confidenceScore: number }}
 */
const analyzeWithGPT = async ({
  transcript,
  scenario,
  fillerWordCount,
  speechSpeedWpm,
  dominantEmotion,
  durationSeconds,
}) => {
  const scenarioLabels = {
    hackathon_pitch: "Hackathon Pitch",
    interview_answer: "Interview Answer",
    leadership_speech: "Leadership Speech",
    self_introduction: "Self Introduction",
    public_speaking: "Public Speaking",
  };

  const scenarioLabel = scenarioLabels[scenario] || "General Speaking";

  const systemPrompt = `You are an expert communication coach and confidence analyst. 
Analyze the provided speech transcript and return a structured JSON response.
Be objective, constructive, and specific in feedback.
Score all metrics from 0 to 10 (decimals allowed, e.g. 7.5).
Return ONLY valid JSON, no markdown, no extra text.`;

  const userPrompt = `Analyze this ${scenarioLabel} speech:

TRANSCRIPT:
"${transcript || "(No speech detected)"}"

METADATA:
- Duration: ${durationSeconds} seconds
- Filler words count: ${fillerWordCount}
- Estimated speech speed: ${speechSpeedWpm} WPM (ideal: 120-160 WPM)
- Dominant emotion detected: ${dominantEmotion}

Return JSON in EXACTLY this format:
{
  "confidenceScore": <0-10>,
  "breakdown": {
    "voiceClarity": <0-10>,
    "speechSpeed": <0-10>,
    "fillerWords": <0-10>,
    "communication": <0-10>,
    "emotionStability": <0-10>
  },
  "feedback": [
    "<specific actionable tip 1>",
    "<specific actionable tip 2>",
    "<specific actionable tip 3>"
  ],
  "summary": "<2 sentence performance summary>"
}

Scoring guidance for fillerWords: 10 = 0 fillers, 8 = 1-2 fillers, 6 = 3-5 fillers, 4 = 6-10 fillers, 2 = 10+ fillers.
Scoring guidance for speechSpeed: 10 = 130-150 WPM, 8 = 110-170 WPM, 6 = 90-180 WPM, lower otherwise.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cost-efficient, fast
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 600,
      response_format: { type: "json_object" },
    });

    const rawText = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(rawText);

    return {
      confidenceScore: parsed.confidenceScore || 5.0,
      breakdown: parsed.breakdown || {},
      feedback: parsed.feedback || [],
      summary: parsed.summary || "",
    };
  } catch (err) {
    console.error("[confidenceService] analyzeWithGPT error:", err.message);
    // Return safe fallback scores
    return {
      confidenceScore: 5.0,
      breakdown: {
        voiceClarity: 5,
        speechSpeed: 5,
        fillerWords: 5,
        communication: 5,
        emotionStability: 5,
      },
      feedback: [
        "Could not fully analyze the speech. Please try again.",
        "Ensure microphone permissions are granted.",
        "Speak clearly for at least 20 seconds for best results.",
      ],
      summary: "Analysis incomplete due to insufficient audio data.",
    };
  }
};

/**
 * Process frontend face analysis data (from face-api.js on client)
 * Converts raw detection metrics into scores
 * @param {object} faceData - { eyeContactRatio, faceDirectionRatio, expressionData, handMovementDetected }
 * @returns {object} faceScores
 */
const processFaceData = (faceData = {}) => {
  const {
    eyeContactRatio = 0.5,
    faceDirectionRatio = 0.5,
    expressionData = {},
    handMovementScore = 5,
  } = faceData;

  // Eye contact: ratio of frames where user looked at camera
  const eyeContact = Math.min(10, parseFloat((eyeContactRatio * 10).toFixed(1)));

  // Face direction: ratio of frames where face was forward-facing
  const faceDirection = Math.min(
    10,
    parseFloat((faceDirectionRatio * 10).toFixed(1))
  );

  // Facial emotion from expression data (positive = higher score)
  const positiveEmotions = ["happy", "surprised", "neutral"];
  let emotionScore = 5;
  if (Object.keys(expressionData).length > 0) {
    const positiveScore = positiveEmotions.reduce(
      (sum, e) => sum + (expressionData[e] || 0),
      0
    );
    emotionScore = Math.min(10, parseFloat((positiveScore * 10).toFixed(1)));
  }

  return {
    eyeContact,
    faceDirection,
    facialEmotion: emotionScore,
    handMovement: Math.min(10, Math.max(0, handMovementScore)),
    bodyLanguage: parseFloat(
      (((eyeContact + faceDirection + handMovementScore) / 3).toFixed(1))
    ),
  };
};

/**
 * Master function: Full confidence analysis pipeline
 * @param {object} params
 * @returns {object} Complete analysis result
 */
const runFullAnalysis = async ({
  audioBuffer,
  mimeType,
  faceData,
  scenario,
  durationSeconds,
}) => {
  console.log("[confidenceService] Starting full analysis pipeline...");

  // Step 1: Transcribe audio
  const transcript = await transcribeAudio(audioBuffer, mimeType);
  console.log(
    `[confidenceService] Transcript (${transcript.length} chars): "${transcript.substring(0, 80)}..."`
  );

  // Step 2: Detect filler words
  const { count: fillerWordCount, words: fillerWordsList } =
    detectFillerWords(transcript);

  // Step 3: Calculate speech speed
  const speechSpeedWpm = calculateSpeechSpeed(transcript, durationSeconds);

  // Step 4: Emotion analysis via HuggingFace
  const emotionResult = await analyzeEmotion(transcript);

  // Step 5: GPT communication analysis
  const gptResult = await analyzeWithGPT({
    transcript,
    scenario,
    fillerWordCount,
    speechSpeedWpm,
    dominantEmotion: emotionResult.dominant,
    durationSeconds,
  });

  // Step 6: Process face analysis data from frontend
  const faceScores = processFaceData(faceData);

  // Step 7: Compute holistic confidence score (weighted average)
  const allScores = {
    eyeContact: faceScores.eyeContact,
    faceDirection: faceScores.faceDirection,
    handMovement: faceScores.handMovement,
    facialEmotion: faceScores.facialEmotion,
    voiceClarity: gptResult.breakdown.voiceClarity || 5,
    speechSpeed: gptResult.breakdown.speechSpeed || 5,
    fillerWords: gptResult.breakdown.fillerWords || 5,
    communication: gptResult.breakdown.communication || 5,
    emotionStability: gptResult.breakdown.emotionStability || 5,
    bodyLanguage: faceScores.bodyLanguage,
  };

  // Weighted confidence score
  const weights = {
    eyeContact: 0.15,
    faceDirection: 0.1,
    handMovement: 0.05,
    facialEmotion: 0.1,
    voiceClarity: 0.15,
    speechSpeed: 0.1,
    fillerWords: 0.1,
    communication: 0.15,
    emotionStability: 0.05,
    bodyLanguage: 0.05,
  };

  const weightedScore = Object.keys(weights).reduce((sum, key) => {
    return sum + (allScores[key] || 0) * weights[key];
  }, 0);

  const finalConfidenceScore = parseFloat(weightedScore.toFixed(1));

  return {
    confidenceScore: finalConfidenceScore,
    breakdown: allScores,
    transcript,
    fillerWordCount,
    fillerWordsList,
    speakingDurationSeconds: durationSeconds,
    dominantEmotion: emotionResult.dominant,
    aiFeedback: gptResult.feedback,
    summary: gptResult.summary,
    rawAnalysis: {
      gpt: gptResult,
      emotion: emotionResult,
      speechSpeedWpm,
    },
  };
};

export {
  runFullAnalysis,
  transcribeAudio,
  detectFillerWords,
  analyzeEmotion,
  analyzeWithGPT,
  processFaceData,
};