// server/services/interviewService.js
import OpenAI from "openai";

// Lazy init — dotenv ke baad call hoga
function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const COMPANY_PERSONAS = {
  Google: "methodical, analytical, asks deep follow-ups on fundamentals and scalability",
  Microsoft: "structured, collaborative, focuses on clear thinking and communication",
  Amazon: "leadership principles focused, expects STAR structured answers",
  Adobe: "product engineering focused, practical coding discussions",
  "Goldman Sachs": "finance-tech focused, analytical and detail oriented",
  Oracle: "database and distributed systems focused, strong backend discussions",
  Paytm: "payments systems focused, APIs and real-world product thinking",
  IBM: "enterprise engineering focused, fundamentals and architecture discussions",
};

const DEFAULT_PERSONA = "professional, balanced, curious about your thinking";

/**
 * FUNCTION 1: Generate the opening question for an interview
 */
async function generateFirstQuestion(company, round, difficulty) {
  const persona = COMPANY_PERSONAS[company] || DEFAULT_PERSONA;

  const systemPrompt = `You are a senior technical interviewer at ${company}. 
Your interviewing style is ${persona}. 
You are conducting a ${round} interview for a fresher position. 
The difficulty level is ${difficulty}.
Ask ONE clear, specific opening question to begin the interview. 
Do not add explanations or pleasantries. Just the question.`;

  const userPrompt = `Start the ${round} interview. Ask the first question appropriate for a ${difficulty} difficulty ${round} round at ${company}.`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    temperature: 0.7,
    max_tokens: 300,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const question = response.choices[0].message.content.trim();

  return {
    question,
    persona,
    tone: getTone(company),
  };
}

/**
 * FUNCTION 2: Generate next question based on previous answer
 */
async function generateNextQuestion(
  previousAnswer,
  questionNumber,
  company,
  round,
  conversationHistory
) {
  const persona = COMPANY_PERSONAS[company] || DEFAULT_PERSONA;

  const systemPrompt = `You are a senior technical interviewer at ${company}. 
Your interviewing style is ${persona}.
You are conducting a ${round} interview for a fresher position.
This is question number ${questionNumber}.

Rules:
- If the previous answer was WEAK or incomplete → ask an easier follow-up or a fresh simpler question
- If the previous answer was STRONG and detailed → ask a harder follow-up or dig deeper into specifics mentioned
- If the candidate mentioned a specific technology or concept → probe deeper into that
- Keep the conversation flowing naturally
- Ask ONE clear question only. No explanations. Just the question.`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...conversationHistory,
    {
      role: "user",
      content: `The candidate just answered: "${previousAnswer}"\n\nAsk the next interview question.`,
    },
  ];

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    temperature: 0.7,
    max_tokens: 300,
    messages,
  });

  const question = response.choices[0].message.content.trim();

  return {
    question,
    isFollowUp: isFollowUpQuestion(previousAnswer),
    questionType: detectQuestionType(question, round),
  };
}

/**
 * FUNCTION 3: Evaluate the full interview
 */
async function evaluateInterview(allAnswers, company, round, difficulty) {
  const persona = COMPANY_PERSONAS[company] || DEFAULT_PERSONA;

  const transcript = allAnswers
    .map(
      (item, i) =>
        `Q${i + 1}: ${item.question}\nA${i + 1}: ${item.answer || "(No answer provided)"}`
    )
    .join("\n\n");

  const systemPrompt = `You are an experienced hiring manager at ${company}.
Evaluate this ${round} interview transcript for a fresher position (difficulty: ${difficulty}).
The interviewer style was: ${persona}.

Return ONLY valid JSON with this exact structure, no markdown, no explanation:
{
  "scores": {
    "communication": <0-100>,
    "technical": <0-100>,
    "confidence": <0-100>,
    "overall": <0-100>
  },
  "strongPoints": ["point1", "point2", "point3"],
  "weakPoints": ["point1", "point2", "point3"],
  "nextSteps": ["step1", "step2", "step3"],
  "detailedFeedback": "2-3 sentence overall assessment"
}`;

  const userPrompt = `Interview Transcript:\n\n${transcript}\n\nEvaluate this candidate.`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    temperature: 0.3,
    max_tokens: 1000,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const rawText = response.choices[0].message.content.trim();

  let parsed;
  try {
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.error("JSON parse error in evaluateInterview:", err);
    parsed = {
      scores: { communication: 50, technical: 50, confidence: 50, overall: 50 },
      strongPoints: ["Attempted all questions", "Showed up and tried"],
      weakPoints: ["Needs more preparation", "Answers lacked depth"],
      nextSteps: [
        "Practice mock interviews regularly",
        "Revise core concepts",
        "Work on structured answers",
      ],
      detailedFeedback:
        "The candidate showed basic understanding but needs more preparation for this role.",
    };
  }

  // Decision logic
  const overall = parsed.scores?.overall ?? 50;
  let decision;
  if (overall > 75) decision = "HIRE";
  else if (overall >= 50) decision = "HOLD";
  else decision = "REJECT";

  return {
    scores: parsed.scores,
    decision,
    strongPoints: parsed.strongPoints || [],
    weakPoints: parsed.weakPoints || [],
    nextSteps: parsed.nextSteps || [],
    detailedFeedback: parsed.detailedFeedback || "",
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTone(company) {
const tones = {
  Google: "analytical",
  Microsoft: "structured",
  Amazon: "formal",
  Adobe: "product-focused",
  "Goldman Sachs": "analytical",
  Oracle: "technical",
  Paytm: "practical",
  IBM: "professional",
};
  return tones[company] || "professional";
}

function isFollowUpQuestion(previousAnswer) {
  if (!previousAnswer) return false;
  const wordCount = previousAnswer.trim().split(/\s+/).length;
  return wordCount < 30;
}

function detectQuestionType(question, round) {
  const q = question.toLowerCase();
  if (q.includes("how") || q.includes("explain") || q.includes("describe"))
    return "conceptual";
  if (q.includes("code") || q.includes("implement") || q.includes("write"))
    return "coding";
  if (q.includes("tell me about") || q.includes("experience"))
    return "behavioral";
  if (q.includes("design") || q.includes("system")) return "system-design";
  return round.toLowerCase().includes("technical") ? "technical" : "general";
}

export { generateFirstQuestion, generateNextQuestion, evaluateInterview };