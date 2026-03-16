// client/src/components/confidence/ConfidenceLens.jsx
// ConfidenceLens AI – Main entry component
// Handles scenario selection, orchestrates camera + report views

import React, { useState } from "react";
import CameraAnalyzer from "./CameraAnalyzer";
import ConfidenceReport from "./ConfidenceReport";
import "./confidence.css";

// ─── Scenario Config ──────────────────────────────────────────────────────────
const SCENARIOS = [
  {
    id: "hackathon_pitch",
    label: "Hackathon Pitch",
    icon: "🚀",
    desc: "Present your idea in 60 seconds",
    color: "#6366f1",
    tips: ["Be energetic", "Show passion", "Clear value prop"],
  },
  {
    id: "interview_answer",
    label: "Interview Answer",
    icon: "💼",
    desc: "Answer behavioral questions confidently",
    color: "#0ea5e9",
    tips: ["Use STAR method", "Maintain eye contact", "Speak clearly"],
  },
  {
    id: "leadership_speech",
    label: "Leadership Speech",
    icon: "🎯",
    desc: "Inspire and motivate your team",
    color: "#8b5cf6",
    tips: ["Command presence", "Project authority", "Vary your tone"],
  },
  {
    id: "self_introduction",
    label: "Self Introduction",
    icon: "👋",
    desc: "Make a memorable first impression",
    color: "#10b981",
    tips: ["Smile naturally", "Be concise", "Show enthusiasm"],
  },
  {
    id: "public_speaking",
    label: "Public Speaking",
    icon: "🎤",
    desc: "Deliver a compelling speech",
    color: "#f59e0b",
    tips: ["Slow down", "Pause for effect", "Engage the audience"],
  },
];

// ─── View States ──────────────────────────────────────────────────────────────
const VIEWS = {
  HOME: "home",
  CAMERA: "camera",
  REPORT: "report",
};

export default function ConfidenceLens() {
  const [view, setView] = useState(VIEWS.HOME);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [hoveredScenario, setHoveredScenario] = useState(null);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleStartScenario = (scenario) => {
    setSelectedScenario(scenario);
    setView(VIEWS.CAMERA);
  };

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    setView(VIEWS.REPORT);
  };

  const handleRetry = () => {
    setAnalysisResult(null);
    setView(VIEWS.HOME);
  };

  const handleRetryScenario = () => {
    setAnalysisResult(null);
    setView(VIEWS.CAMERA);
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  if (view === VIEWS.CAMERA && selectedScenario) {
    return (
      <CameraAnalyzer
        scenario={selectedScenario}
        onComplete={handleAnalysisComplete}
        onCancel={() => setView(VIEWS.HOME)}
      />
    );
  }

  if (view === VIEWS.REPORT && analysisResult) {
    return (
      <ConfidenceReport
        result={analysisResult}
        scenario={selectedScenario}
        onRetry={handleRetry}
        onRetryScenario={handleRetryScenario}
      />
    );
  }

  // HOME view — scenario selection
  return (
    <div className="cl-wrapper">
      {/* Header */}
      <div className="cl-header">
        <div className="cl-header-badge">
          <span className="cl-badge-dot" />
          AI-Powered Analysis
        </div>
        <h1 className="cl-title">
          Confidence<span className="cl-title-accent">Lens</span>
          <span className="cl-title-ai"> AI</span>
        </h1>
        <p className="cl-subtitle">
          Analyze your communication confidence with real-time AI feedback on
          eye contact, voice clarity, facial expressions, and more.
        </p>

        {/* Feature pills */}
        <div className="cl-feature-pills">
          {[
            { icon: "👁️", label: "Eye Contact" },
            { icon: "🎙️", label: "Voice Analysis" },
            { icon: "😊", label: "Emotion Detection" },
            { icon: "🤲", label: "Body Language" },
          ].map((feat) => (
            <span key={feat.label} className="cl-pill">
              {feat.icon} {feat.label}
            </span>
          ))}
        </div>
      </div>

      {/* Scenario grid */}
      <div className="cl-section">
        <h2 className="cl-section-title">Choose Your Scenario</h2>
        <p className="cl-section-sub">
          Select what you're practicing — the AI tailors its feedback accordingly
        </p>

        <div className="cl-scenarios-grid">
          {SCENARIOS.map((scenario) => (
            <div
              key={scenario.id}
              className={`cl-scenario-card ${
                hoveredScenario === scenario.id ? "cl-scenario-card--hovered" : ""
              }`}
              style={{ "--scenario-color": scenario.color }}
              onMouseEnter={() => setHoveredScenario(scenario.id)}
              onMouseLeave={() => setHoveredScenario(null)}
              onClick={() => handleStartScenario(scenario)}
            >
              <div className="cl-scenario-icon">{scenario.icon}</div>
              <div className="cl-scenario-content">
                <h3 className="cl-scenario-label">{scenario.label}</h3>
                <p className="cl-scenario-desc">{scenario.desc}</p>
                <div className="cl-scenario-tips">
                  {scenario.tips.map((tip) => (
                    <span key={tip} className="cl-scenario-tip">
                      ✓ {tip}
                    </span>
                  ))}
                </div>
              </div>
              <button className="cl-scenario-btn">
                Start
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12H19M12 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="cl-howto">
        <h3 className="cl-howto-title">How It Works</h3>
        <div className="cl-steps">
          {[
            {
              step: "01",
              title: "Choose Scenario",
              desc: "Pick what you want to practice",
            },
            {
              step: "02",
              title: "Speak for 20–60s",
              desc: "Camera & mic capture your session",
            },
            {
              step: "03",
              title: "Real-time Feedback",
              desc: "Live green/red indicators guide you",
            },
            {
              step: "04",
              title: "AI Report",
              desc: "Get your confidence score + tips",
            },
          ].map((item, i) => (
            <div key={i} className="cl-step">
              <span className="cl-step-num">{item.step}</span>
              <strong className="cl-step-title">{item.title}</strong>
              <p className="cl-step-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}