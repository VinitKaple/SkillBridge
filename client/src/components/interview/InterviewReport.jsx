import { useState, useEffect, useRef } from "react";

const DECISION_CONFIG = {
  HIRE: {
    label: "Selected",
    sublabel: "You are ready for this role!",
    bg: "bg-green-50",
    border: "border-green-200",
    badge: "bg-green-100 text-green-700",
    text: "text-green-700",
    ring: "#22c55e",
    icon: (
      <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  HOLD: {
    label: "On Hold",
    sublabel: "Almost there! A bit more prep and you will crack it.",
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    text: "text-amber-700",
    ring: "#f59e0b",
    icon: (
      <svg className="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  REJECT: {
    label: "Keep Practicing",
    sublabel: "Don't give up! Review the feedback and try again.",
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-600",
    text: "text-red-600",
    ring: "#ef4444",
    icon: (
      <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

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
    return () => { clearTimeout(timeout); cancelAnimationFrame(frameRef.current); };
  }, [target, delay, duration]);

  return value;
}

function ScoreCircle({ score, label, delay }) {
  const animated = useCountUp(score, delay);
  const r = 38;
  const circ = 2 * Math.PI * r;
  const dash = ((animated / 100) * circ).toFixed(1);
  const color = score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 90 90" className="w-full h-full">
          <circle cx="45" cy="45" r={r} fill="none" stroke="#f3f4f6" strokeWidth="7" />
          <circle
            cx="45" cy="45" r={r}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            transform="rotate(-90 45 45)"
            style={{ transition: "stroke-dasharray 0.05s linear" }}
          />
          <text x="45" y="51" textAnchor="middle" fontSize="17" fontWeight="700" fill={color}>
            {animated}
          </text>
        </svg>
      </div>
      <p className="text-xs font-medium text-gray-500 text-center">{label}</p>
    </div>
  );
}

function getCompanyTip(company, decision) {
  const tips = {
    Google: {
      HIRE: "Focus on system design depth and LeetCode hard problems before the real interview.",
      HOLD: "Google values fundamentals. Practice data structures, algorithms, and scalability concepts.",
      REJECT: "Start with LeetCode easy/medium, master Big O notation, revisit CS fundamentals.",
    },
    Amazon: {
      HIRE: "Polish your STAR stories and align them with Amazon's 16 Leadership Principles.",
      HOLD: "Practice STAR format rigorously. Map your experiences to Amazon's Leadership Principles.",
      REJECT: "Study Amazon's Leadership Principles deeply. Prepare 2-3 strong STAR stories each.",
    },
    Razorpay: {
      HIRE: "Brush up on payment gateway flows, security (PCI-DSS), and fintech architecture.",
      HOLD: "Strengthen knowledge of payment systems, APIs, and transaction security.",
      REJECT: "Learn payment gateway basics, REST APIs, and common fintech security challenges.",
    },
    Swiggy: {
      HIRE: "Prepare for deep dives into operations, microservices, and high-availability systems.",
      HOLD: "Focus on real-world system failures, logistics optimization, and distributed systems.",
      REJECT: "Study food delivery platform architecture, ops-heavy case studies and backend scalability.",
    },
    Microsoft: {
      HIRE: "Show collaborative spirit and growth mindset in the next rounds.",
      HOLD: "Practice behavioral questions and demonstrate a growth mindset consistently.",
      REJECT: "Focus on behavioral interviews, collaborative scenarios, and Azure fundamentals.",
    },
    Flipkart: {
      HIRE: "Prepare for product cases, India-scale problems, and e-commerce architecture.",
      HOLD: "Strengthen product thinking and Indian market context. Practice e-commerce case studies.",
      REJECT: "Study e-commerce platforms, product management basics, and India-scale system design.",
    },
  };
  return tips[company]?.[decision] || "Keep practicing regularly, focus on weak areas, and you will improve steadily.";
}

export default function InterviewReport({ reportData, onRetake }) {
  const decision = reportData?.decision || "HOLD";
  const scores = reportData?.scores || {};
  const strongPoints = reportData?.strongPoints || [];
  const weakPoints = reportData?.weakPoints || [];
  const nextSteps = reportData?.nextSteps || [];
  const detailedFeedback = reportData?.detailedFeedback || "";
  const company = reportData?.company || "";
  const round = reportData?.round || "";

  const dc = DECISION_CONFIG[decision] || DECISION_CONFIG.HOLD;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Interview Report</p>
            <p className="text-xs text-gray-400 capitalize">{company} · {round?.replace("-", " ")}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onRetake}
            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = "/mock-interview"}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
          >
            New Interview
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">

        {/* Decision Banner */}
        <div className={`rounded-3xl border-2 ${dc.border} ${dc.bg} p-6 flex items-center gap-5`}>
          <div className={`w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0`}>
            {dc.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className={`text-2xl font-bold ${dc.text}`}>{dc.label}</h2>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${dc.badge}`}>
                {scores.overall ?? 0}% Overall
              </span>
            </div>
            <p className={`text-sm ${dc.text} opacity-80`}>{dc.sublabel}</p>
            <p className="text-xs text-gray-400 mt-1 capitalize">{company} · {round?.replace("-", " ")} · {reportData?.difficulty}</p>
          </div>
        </div>

        {/* Score Cards */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-5">Performance Scores</h3>
          <div className="grid grid-cols-4 gap-4">
            <ScoreCircle score={scores.communication ?? 0} label="Communication" delay={0} />
            <ScoreCircle score={scores.technical ?? 0} label="Technical Depth" delay={200} />
            <ScoreCircle score={scores.confidence ?? 0} label="Confidence" delay={400} />
            <ScoreCircle score={scores.overall ?? 0} label="Overall" delay={600} />
          </div>
        </div>

        {/* Overall Assessment */}
        {detailedFeedback && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </span>
              Overall Assessment
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed border-l-4 border-blue-200 pl-4 italic">
              "{detailedFeedback}"
            </p>
          </div>
        )}

        {/* Strong + Weak Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-green-50 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              Strong Points
            </h3>
            <ul className="space-y-2.5">
              {strongPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 shrink-0" />
                  {pt}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-50 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              Areas to Improve
            </h3>
            <ul className="space-y-2.5">
              {weakPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Next Steps */}
        {nextSteps.length > 0 && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              Recommended Next Steps
            </h3>
            <div className="space-y-2.5">
              {nextSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-3 bg-blue-50 rounded-xl px-4 py-3">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-semibold shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-sm text-blue-800">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Company Tip */}
        {company && (
          <div className="bg-gray-900 rounded-3xl p-5">
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </span>
              {company} Specific Tip
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {getCompanyTip(company, decision)}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pb-6">
          <button
            onClick={onRetake}
            className="flex-1 py-3 rounded-2xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
          >
            Try Again
          </button>
          <button
            onClick={() => {
              const text = `I scored ${scores.overall ?? 0}/100 in a ${company} ${round} mock interview on SkillBridge!`;
              navigator.clipboard?.writeText(text);
              alert("Result copied!");
            }}
            className="flex-1 py-3 rounded-2xl border border-blue-200 bg-blue-50 text-sm font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
          >
            Share Result
          </button>
          <button
            onClick={() => window.location.href = "/mock-interview"}
            className="flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            New Interview
          </button>
        </div>
      </div>
    </div>
  );
}