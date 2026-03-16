import { useState, useEffect, useRef } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_QUESTIONS = 10;
const FAIR_THRESHOLD = 5; // minimum questions for a "reliable" eval

/**
 * Adjusts raw AI scores based on how many questions were actually answered.
 *
 * Formula:  adjustedScore = rawScore × (MIN_WEIGHT + (1 - MIN_WEIGHT) × completionRatio)
 *   - MIN_WEIGHT = 0.4  → even 1 answered question can't inflate above 40% of raw
 *   - completionRatio   → 0..1 based on attempted / TOTAL_QUESTIONS
 *
 * Examples:
 *   2 /10 answered, raw=90 → 90 × (0.4 + 0.6×0.2)  = 90 × 0.52 = 47
 *   5 /10 answered, raw=80 → 80 × (0.4 + 0.6×0.5)  = 80 × 0.70 = 56
 *  10 /10 answered, raw=80 → 80 × (0.4 + 0.6×1.0)  = 80 × 1.00 = 80  (no change)
 */
function computeAdjustedScores(rawScores, attempted) {
  const completionRatio = Math.min(attempted / TOTAL_QUESTIONS, 1);
  const weight = 0.4 + 0.6 * completionRatio;

  const adj = {};
  for (const key of ["communication", "technical", "confidence", "overall"]) {
    adj[key] = Math.round((rawScores[key] ?? 0) * weight);
  }
  return adj;
}

/** Derive HIRE / HOLD / REJECT from the (adjusted) overall score */
function decisionFromScore(overallScore) {
  if (overallScore >= 75) return "HIRE";
  if (overallScore >= 45) return "HOLD";
  return "REJECT";
}

// ─── Config maps ──────────────────────────────────────────────────────────────

const DECISION_CONFIG = {
  HIRE: {
    label: "Selected",
    sublabel: "Strong performance — you are ready for this role.",
    bg: "bg-green-50",
    border: "border-green-200",
    badge: "bg-green-100 text-green-700",
    text: "text-green-700",
    ring: "#22c55e",
    barColor: "bg-green-500",
    icon: (
      <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  HOLD: {
    label: "On Hold",
    sublabel: "Almost there — a focused 2-week sprint will get you ready.",
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    text: "text-amber-700",
    ring: "#f59e0b",
    barColor: "bg-amber-500",
    icon: (
      <svg className="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  REJECT: {
    label: "Keep Practicing",
    sublabel: "Don't give up — review the feedback and come back stronger.",
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-600",
    text: "text-red-600",
    ring: "#ef4444",
    barColor: "bg-red-500",
    icon: (
      <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

const SCORE_META = {
  communication: {
    label: "Communication",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    tip: "Clarity, structure and articulation of ideas",
  },
  technical: {
    label: "Technical Depth",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    tip: "Accuracy and depth of technical knowledge",
  },
  confidence: {
    label: "Confidence",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    tip: "Delivery, tone and assuredness in responses",
  },
  overall: {
    label: "Overall Score",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    tip: "Composite score across all dimensions",
  },
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useCountUp(target, delay = 0, duration = 1400) {
  const [value, setValue] = useState(0);
  const frameRef = useRef(null);
  useEffect(() => {
    if (!target) return;
    const timeout = setTimeout(() => {
      let start = null;
      const step = (ts) => {
        if (!start) start = ts;
        const elapsed = ts - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) frameRef.current = requestAnimationFrame(step);
      };
      frameRef.current = requestAnimationFrame(step);
    }, delay);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frameRef.current);
    };
  }, [target, delay, duration]);
  return value;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function IncompleteWarningBanner({ attempted, total }) {
  const pct = Math.round((attempted / total) * 100);
  return (
    <div className="rounded-2xl border-2 border-orange-300 bg-orange-50 p-4 flex gap-3 items-start">
      {/* icon */}
      <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-orange-800 mb-0.5">
          Incomplete Interview — Scores Adjusted
        </p>
        <p className="text-xs text-orange-700 leading-relaxed">
          You answered <strong>{attempted} of {total}</strong> questions ({pct}% complete).
          Scores have been <strong>weighted down</strong> to reflect the partial attempt.
          Technical Depth, Confidence and Hiring Readiness cannot be reliably assessed
          on fewer than {FAIR_THRESHOLD} answers.
          Complete more questions for an accurate evaluation.
        </p>
        {/* mini progress bar */}
        <div className="mt-2.5 h-1.5 w-full rounded-full bg-orange-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-orange-400 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-orange-500 mt-1">{pct}% of interview completed</p>
      </div>
    </div>
  );
}

function ScoreCircle({ score, label, delay, size = "md", dimmed = false }) {
  const animated = useCountUp(score, delay);
  const r = size === "lg" ? 52 : 38;
  const vb = size === "lg" ? 120 : 90;
  const cx = vb / 2;
  const circ = 2 * Math.PI * r;
  const dash = ((animated / 100) * circ).toFixed(1);
  const color = dimmed
    ? "#9ca3af"
    : score >= 75
    ? "#22c55e"
    : score >= 50
    ? "#f59e0b"
    : "#ef4444";
  const trackColor = dimmed ? "#f3f4f6" : score >= 75 ? "#dcfce7" : score >= 50 ? "#fef3c7" : "#fee2e2";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`${size === "lg" ? "relative w-32 h-32" : "relative w-24 h-24"} ${dimmed ? "opacity-60" : ""}`}>
        <svg viewBox={`0 0 ${vb} ${vb}`} className="w-full h-full">
          <circle cx={cx} cy={cx} r={r} fill="none" stroke={trackColor} strokeWidth={size === "lg" ? 9 : 7} />
          <circle
            cx={cx} cy={cx} r={r}
            fill="none" stroke={color}
            strokeWidth={size === "lg" ? 9 : 7}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            transform={`rotate(-90 ${cx} ${cx})`}
            style={{ transition: "stroke-dasharray 0.05s linear" }}
          />
          <text
            x={cx} y={cx + (size === "lg" ? 7 : 5)}
            textAnchor="middle"
            fontSize={size === "lg" ? 22 : 17}
            fontWeight="700"
            fill={color}
          >
            {animated}
          </text>
        </svg>
      </div>
      <p className={`text-xs font-medium text-center ${dimmed ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
    </div>
  );
}

function ScoreBar({ label, score, icon, tip, delay, dimmed = false }) {
  const animated = useCountUp(score, delay);
  const color   = dimmed ? "bg-gray-400"   : score >= 75 ? "bg-green-500"  : score >= 50 ? "bg-amber-500"  : "bg-red-500";
  const track   = dimmed ? "bg-gray-100"   : score >= 75 ? "bg-green-100"  : score >= 50 ? "bg-amber-100"  : "bg-red-100";
  const textCol = dimmed ? "text-gray-400" : score >= 75 ? "text-green-700": score >= 50 ? "text-amber-700": "text-red-600";

  return (
    <div className={`flex items-center gap-4 ${dimmed ? "opacity-60" : ""}`}>
      <div className={`w-8 h-8 rounded-lg ${track} flex items-center justify-center ${textCol} shrink-0`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className={`text-sm font-bold ${textCol}`}>{animated}%</span>
        </div>
        <div className={`h-2 rounded-full ${track} overflow-hidden`}>
          <div
            className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`}
            style={{ width: `${animated}%`, transitionDelay: `${delay}ms` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">{tip}</p>
      </div>
    </div>
  );
}

function QuestionCard({ qa, index }) {
  const [open, setOpen] = useState(false);
  const wordCount = qa.answer?.trim().split(/\s+/).filter(Boolean).length || 0;
  const quality = wordCount >= 60 ? "Strong" : wordCount >= 25 ? "Moderate" : "Brief";
  const qualityColor =
    wordCount >= 60 ? "text-green-600 bg-green-50" :
    wordCount >= 25 ? "text-amber-600 bg-amber-50" :
    "text-red-600 bg-red-50";

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0">
            Q{index + 1}
          </span>
          <p className="text-sm font-medium text-gray-800 line-clamp-1">{qa.question}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${qualityColor}`}>{quality}</span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-gray-50 bg-gray-50">
          <p className="text-xs font-semibold text-gray-500 mt-4 mb-1 uppercase tracking-wide">Question</p>
          <p className="text-sm text-gray-700 mb-4">{qa.question}</p>
          <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Your Answer</p>
          <p className="text-sm text-gray-600 leading-relaxed bg-white rounded-xl p-3 border border-gray-100">
            {qa.answer || "(No answer given)"}
          </p>
          <p className="text-xs text-gray-400 mt-2">{wordCount} words · {quality} response</p>
        </div>
      )}
    </div>
  );
}

function RadarChart({ scores, dimmed = false }) {
  const dims = [
    { key: "communication", label: "Comm.", angle: -90 },
    { key: "technical",     label: "Technical", angle: -90 + 120 },
    { key: "confidence",    label: "Confidence", angle: -90 + 240 },
  ];
  const cx = 100, cy = 100, r = 70;

  const points = dims.map((d) => {
    const angle = (d.angle * Math.PI) / 180;
    const val = (scores[d.key] || 0) / 100;
    return { x: cx + r * val * Math.cos(angle), y: cy + r * val * Math.sin(angle) };
  });

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const fillColor  = dimmed ? "rgba(156,163,175,0.15)" : "rgba(37,99,235,0.15)";
  const strokeColor = dimmed ? "#9ca3af" : "#2563eb";

  return (
    <svg viewBox="0 0 200 200" className={`w-full max-w-[180px] ${dimmed ? "opacity-60" : ""}`}>
      {gridLevels.map((level) => {
        const gpts = dims.map((d) => {
          const angle = (d.angle * Math.PI) / 180;
          return `${cx + r * level * Math.cos(angle)},${cy + r * level * Math.sin(angle)}`;
        });
        return <polygon key={level} points={gpts.join(" ")} fill="none" stroke="#e5e7eb" strokeWidth="0.5" />;
      })}
      {dims.map((d) => {
        const angle = (d.angle * Math.PI) / 180;
        return (
          <line key={d.key} x1={cx} y1={cy}
            x2={cx + r * Math.cos(angle)} y2={cy + r * Math.sin(angle)}
            stroke="#e5e7eb" strokeWidth="0.5" />
        );
      })}
      <polygon
        points={points.map((p) => `${p.x},${p.y}`).join(" ")}
        fill={fillColor} stroke={strokeColor} strokeWidth="1.5"
      />
      {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill={strokeColor} />)}
      {dims.map((d) => {
        const angle = (d.angle * Math.PI) / 180;
        const lx = cx + (r + 18) * Math.cos(angle);
        const ly = cy + (r + 18) * Math.sin(angle);
        return (
          <text key={d.key} x={lx} y={ly} textAnchor="middle" dominantBaseline="central"
            fontSize="9" fill="#6b7280" fontWeight="500">
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function InterviewReport({ reportData, onRetake }) {
  // Raw data from AI
  const rawScores       = reportData?.scores || {};
  const answers         = reportData?.answers || [];
  const attempted       = answers.length || reportData?.attemptedQuestions || 0;
  const strongPoints    = reportData?.strongPoints || [];
  const weakPoints      = reportData?.weakPoints  || [];
  const nextSteps       = reportData?.nextSteps   || [];
  const detailedFeedback = reportData?.detailedFeedback || "";
  const company         = reportData?.company    || "";
  const round           = reportData?.round      || "";
  const difficulty      = reportData?.difficulty || "";

  // ── Key fix: compute completion-weighted scores ──────────────────────────
  const isIncomplete   = attempted < FAIR_THRESHOLD;
  const adjustedScores = computeAdjustedScores(rawScores, attempted);

  // Re-derive decision from adjusted overall (not from whatever AI said)
  const decision = decisionFromScore(adjustedScores.overall);
  const dc       = DECISION_CONFIG[decision];

  // Labels
  const roundLabel = {
    "core-cs"   : "Core CS Round",
    dsa         : "DSA Round",
    hr          : "HR Round",
    "full-loop" : "Full Interview Loop",
  }[round] || round;

  const difficultyLabel = {
    fresher       : "Fresher",
    "six-months"  : "6 Months Exp.",
    "one-year"    : "1 Year Exp.",
  }[difficulty] || difficulty;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Top Bar ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Interview Report</p>
            <p className="text-xs text-gray-400 capitalize">{company} · {roundLabel} · {difficultyLabel}</p>
          </div>
        </div>
        <button
          onClick={onRetake || (() => window.location.href = "/mock-interview")}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
        >
          New Interview
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">

        {/* ── ⚠️ Incomplete warning (shown only when < FAIR_THRESHOLD answers) ── */}
        {isIncomplete && (
          <IncompleteWarningBanner attempted={attempted} total={TOTAL_QUESTIONS} />
        )}

        {/* ── Decision Banner ── */}
        <div className={`rounded-3xl border-2 ${dc.border} ${dc.bg} p-6`}>
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
              {dc.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h2 className={`text-2xl font-bold ${dc.text}`}>{dc.label}</h2>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${dc.badge}`}>
                  {adjustedScores.overall}% Overall
                  {isIncomplete && (
                    <span className="ml-1 opacity-70">(adjusted)</span>
                  )}
                </span>
              </div>
              <p className={`text-sm ${dc.text} opacity-80 mb-2`}>{dc.sublabel}</p>
              {/* show completion context when incomplete */}
              {isIncomplete && (
                <p className="text-xs text-orange-600 font-medium mb-2">
                  ⚠ Based on {attempted}/{TOTAL_QUESTIONS} questions answered — score penalised for incomplete attempt
                </p>
              )}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs bg-white/70 text-gray-600 px-2.5 py-1 rounded-full border border-gray-200">{company}</span>
                <span className="text-xs bg-white/70 text-gray-600 px-2.5 py-1 rounded-full border border-gray-200">{roundLabel}</span>
                <span className="text-xs bg-white/70 text-gray-600 px-2.5 py-1 rounded-full border border-gray-200">{difficultyLabel}</span>
                <span className="text-xs bg-white/70 text-gray-600 px-2.5 py-1 rounded-full border border-gray-200">
                  {attempted}/{TOTAL_QUESTIONS} questions
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Score Overview: circles + radar ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-1">Performance Breakdown</h3>
          <p className="text-xs text-gray-400 mb-1">
            Scores across {attempted} question{attempted !== 1 ? "s" : ""} — evaluated by AI
          </p>
          {isIncomplete && (
            <p className="text-xs text-orange-500 mb-4 font-medium">
              Scores adjusted for {attempted}/{TOTAL_QUESTIONS} completion
            </p>
          )}

          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="grid grid-cols-4 gap-3 flex-1">
              <ScoreCircle score={adjustedScores.communication} label="Communication" delay={0}   dimmed={isIncomplete} />
              <ScoreCircle score={adjustedScores.technical}     label="Technical"     delay={200} dimmed={isIncomplete} />
              <ScoreCircle score={adjustedScores.confidence}    label="Confidence"    delay={400} dimmed={isIncomplete} />
              <ScoreCircle score={adjustedScores.overall}       label="Overall"       delay={600} />
            </div>
            <div className="flex flex-col items-center gap-2 shrink-0">
              <RadarChart scores={adjustedScores} dimmed={isIncomplete} />
              <p className="text-xs text-gray-400">Skill radar{isIncomplete ? " (partial)" : ""}</p>
            </div>
          </div>
        </div>

        {/* ── Score Bars ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-5">Detailed Metrics</h3>
          <div className="space-y-5">
            {["communication", "technical", "confidence", "overall"].map((key, i) => (
              <ScoreBar
                key={key}
                label={SCORE_META[key].label}
                icon={SCORE_META[key].icon}
                tip={SCORE_META[key].tip}
                score={adjustedScores[key] ?? 0}
                delay={i * 150}
                dimmed={isIncomplete && key !== "overall"}
              />
            ))}
          </div>
        </div>

        {/* ── AI Assessment ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-800">AI Hiring Manager Assessment</h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{detailedFeedback}</p>
          {isIncomplete && (
            <p className="text-xs text-orange-500 mt-3 font-medium">
              ⚠ This assessment is based on a partial interview ({attempted}/{TOTAL_QUESTIONS} questions).
            </p>
          )}
        </div>

        {/* ── Strong + Weak ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-800">What Went Well</h3>
            </div>
            <ul className="space-y-2.5">
              {strongPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">✓</span>
                  {pt}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-lg bg-red-100 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-800">Areas to Improve</h3>
            </div>
            <ul className="space-y-2.5">
              {weakPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-500 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">!</span>
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Q&A Transcript ── */}
        {answers.length > 0 && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-800">Interview Transcript</h3>
              <span className="text-xs text-gray-400 ml-auto">{answers.length} questions reviewed</span>
            </div>
            <div className="space-y-2">
              {answers.map((qa, i) => (
                <QuestionCard key={i} qa={qa} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* ── Next Steps ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-800">Action Plan</h3>
          </div>
          <div className="space-y-3">
            {nextSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <p className="text-sm text-blue-800 font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Hiring Readiness ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-1">Hiring Readiness</h3>
          {isIncomplete && (
            <p className="text-xs text-orange-500 mb-3 font-medium">
              ⚠ Readiness scores adjusted — only {attempted}/{TOTAL_QUESTIONS} questions answered
            </p>
          )}
          <div className="space-y-3 mt-3">
            {[
              { label: `Ready for ${company}`,    score: adjustedScores.overall    ?? 0 },
              { label: "Interview Confidence",      score: adjustedScores.confidence ?? 0 },
              { label: "Technical Soundness",       score: adjustedScores.technical  ?? 0 },
            ].map((item, i) => {
              const pct  = item.score;
              // if incomplete, cap the readiness label at "Needs Work" unless genuinely high
              const color     = pct >= 75 ? "bg-green-500" : pct >= 50 ? "bg-amber-500" : "bg-red-400";
              const textColor = pct >= 75 ? "text-green-600" : pct >= 50 ? "text-amber-600" : "text-red-500";
              const readLabel = pct >= 75 ? "Job Ready" : pct >= 50 ? "Almost Ready" : "Needs Work";

              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-44 shrink-0">{item.label}</span>
                  <div className="flex-1 h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`}
                      style={{ width: `${pct}%`, transitionDelay: `${i * 200 + 600}ms` }}
                    />
                  </div>
                  <span className={`text-xs font-semibold w-20 text-right ${textColor}`}>{readLabel}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="pt-2 pb-8">
          <button
            onClick={onRetake || (() => window.location.href = "/mock-interview")}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Start New Interview
          </button>
        </div>

      </div>
    </div>
  );
}