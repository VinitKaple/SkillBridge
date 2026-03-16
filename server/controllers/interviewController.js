import crypto from "crypto";
import {
  generateFirstQuestion,
  generateNextQuestion,
  evaluateInterview,
} from "../services/interviewService.js";

// ─── In-memory session store ───────────────────────────────────────────────
// Map<sessionId, { company, round, difficulty, conversationHistory, createdAt }>
const sessions = new Map();

// Optional: clean up sessions older than 1 hour
setInterval(() => {
  const ONE_HOUR = 60 * 60 * 1000;
  const now = Date.now();
  for (const [id, session] of sessions.entries()) {
    if (now - session.createdAt > ONE_HOUR) {
      sessions.delete(id);
      console.log(`[Session] Cleaned up expired session: ${id}`);
    }
  }
}, 15 * 60 * 1000); // run every 15 minutes

// ─── Companies list ────────────────────────────────────────────────────────
const COMPANIES = [
  {
    name: "Google",
    logo: "🔵",
    tier: "Tier 1",
    description: "Strong focus on algorithms, system design and scalability",
  },
  {
    name: "Microsoft",
    logo: "🟦",
    tier: "Tier 1",
    description: "Structured interviews focusing on problem solving and collaboration",
  },
  {
    name: "Amazon",
    logo: "🟠",
    tier: "Tier 1",
    description: "Leadership principles + technical depth",
  },
  {
    name: "Adobe",
    logo: "🟥",
    tier: "Tier 1",
    description: "Product engineering and strong CS fundamentals",
  },
  {
    name: "Goldman Sachs",
    logo: "🟨",
    tier: "Tier 1",
    description: "Finance-tech focused interviews with strong problem solving",
  },
  {
    name: "Oracle",
    logo: "🔴",
    tier: "Tier 2",
    description: "Database, distributed systems and backend concepts",
  },
  {
    name: "Paytm",
    logo: "🔷",
    tier: "Tier 2",
    description: "Payments systems, APIs and real-world scalability",
  },
  {
    name: "IBM",
    logo: "⚫",
    tier: "Tier 2",
    description: "Enterprise systems and strong fundamentals",
  },
];

// ─── Controllers ──────────────────────────────────────────────────────────

/**
 * POST /api/interview/start
 */
async function startInterview(req, res) {
  try {
    const { company, round, difficulty, resumeData } = req.body;

    if (!company || !round || !difficulty) {
      return res
        .status(400)
        .json({ error: "company, round, and difficulty are required." });
    }

    const sessionId = crypto.randomUUID();
    const totalQuestions = 5; // standard interview length

    console.log(`[Interview] Starting session ${sessionId} — ${company} / ${round} / ${difficulty}`);

    const { question, persona, tone } = await generateFirstQuestion(
      company,
      round,
      difficulty
    );

    // Store session
    sessions.set(sessionId, {
      company,
      round,
      difficulty,
      resumeData: resumeData || null,
      conversationHistory: [
        { role: "assistant", content: question },
      ],
      createdAt: Date.now(),
    });

    return res.status(200).json({
      sessionId,
      firstQuestion: question,
      interviewerPersona: persona,
      totalQuestions,
    });
  } catch (err) {
    console.error("[startInterview] Error:", err.message);
    return res
      .status(500)
      .json({ error: "Failed to start interview. Please try again." });
  }
}

/**
 * POST /api/interview/next-question
 */
async function nextQuestion(req, res) {
  try {
    const { sessionId, previousAnswer, questionNumber, company, round } =
      req.body;

    if (!sessionId || !previousAnswer) {
      return res
        .status(400)
        .json({ error: "sessionId and previousAnswer are required." });
    }

    const session = sessions.get(sessionId);
    if (!session) {
      return res
        .status(404)
        .json({ error: "Session not found. Please restart the interview." });
    }

    // Append candidate's answer to history
    session.conversationHistory.push({
      role: "user",
      content: previousAnswer,
    });

    console.log(`[Interview] Session ${sessionId} — generating Q${questionNumber + 1}`);

    const { question, isFollowUp, questionType } = await generateNextQuestion(
      previousAnswer,
      questionNumber,
      company || session.company,
      round || session.round,
      session.conversationHistory
    );

    // Append new question to history
    session.conversationHistory.push({
      role: "assistant",
      content: question,
    });

    return res.status(200).json({
      question,
      isFollowUp,
      hint: getHint(questionType),
    });
  } catch (err) {
    console.error("[nextQuestion] Error:", err.message);
    return res
      .status(500)
      .json({ error: "Failed to generate next question. Please try again." });
  }
}

/**
 * POST /api/interview/evaluate
 */
async function evaluate(req, res) {
  try {
    const { sessionId, allAnswers, company, round, difficulty } = req.body;

    if (!allAnswers || !Array.isArray(allAnswers) || allAnswers.length === 0) {
      return res
        .status(400)
        .json({ error: "allAnswers array is required and must not be empty." });
    }

    const session = sessions.get(sessionId);
    const effectiveCompany = company || session?.company || "Unknown";
    const effectiveRound = round || session?.round || "Technical";
    const effectiveDifficulty = difficulty || session?.difficulty || "Medium";

    console.log(`[Interview] Evaluating session ${sessionId} — ${allAnswers.length} answers`);

    const report = await evaluateInterview(
      allAnswers,
      effectiveCompany,
      effectiveRound,
      effectiveDifficulty
    );

    // Clean up session after evaluation
    if (sessionId && sessions.has(sessionId)) {
      sessions.delete(sessionId);
      console.log(`[Session] Removed session after evaluation: ${sessionId}`);
    }

    return res.status(200).json(report);
  } catch (err) {
    console.error("[evaluate] Error:", err.message);
    return res
      .status(500)
      .json({ error: "Failed to evaluate interview. Please try again." });
  }
}

/**
 * GET /api/interview/companies
 */
function getCompanies(req, res) {
  return res.status(200).json({ companies: COMPANIES });
}

// ─── Helper ────────────────────────────────────────────────────────────────

function getHint(questionType) {
  const hints = {
    conceptual: "Explain your thought process clearly.",
    coding: "Think aloud, mention edge cases.",
    behavioral: "Use the STAR method: Situation, Task, Action, Result.",
    "system-design": "Start with requirements, then high-level design.",
    technical: "Be specific, use examples where possible.",
    general: "Be concise and structured.",
  };
  return hints[questionType] || hints.general;
}

export {
  startInterview,
  nextQuestion,
  evaluate,
  getCompanies,
};