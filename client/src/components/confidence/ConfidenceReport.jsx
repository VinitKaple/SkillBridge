// client/src/components/confidence/ConfidenceReport.jsx
// ConfidenceLens AI – Final AI-generated confidence report component

import React, { useEffect, useRef, useState } from "react";
import "./confidence.css";

// ─── Score to color mapping ───────────────────────────────────────────────────
const scoreColor = (score) => {
  if (score >= 8) return "#22c55e";
  if (score >= 6) return "#f59e0b";
  return "#ef4444";
};

const scoreLabel = (score) => {
  if (score >= 8.5) return "Excellent";
  if (score >= 7) return "Good";
  if (score >= 5) return "Average";
  return "Needs Work";
};

// ─── Metric config ────────────────────────────────────────────────────────────
const METRICS = [
  { key: "eyeContact", label: "Eye Contact", icon: "👁️" },
  { key: "faceDirection", label: "Face Direction", icon: "🎯" },
  { key: "voiceClarity", label: "Voice Clarity", icon: "🎙️" },
  { key: "speechSpeed", label: "Speech Speed", icon: "⚡" },
  { key: "fillerWords", label: "Filler Words", icon: "🗣️" },
  { key: "communication", label: "Communication", icon: "💬" },
  { key: "emotionStability", label: "Emotion Stability", icon: "😌" },
  { key: "facialEmotion", label: "Facial Expression", icon: "😊" },
  { key: "bodyLanguage", label: "Body Language", icon: "🤲" },
];

// ─── Animated score ring ──────────────────────────────────────────────────────
function ScoreRing({ score, size = 160 }) {
  const [animScore, setAnimScore] = useState(0);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (animScore / 10) * circumference;

  useEffect(() => {
    let start = 0;
    const step = score / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= score) {
        setAnimScore(score);
        clearInterval(timer);
      } else {
        setAnimScore(parseFloat(start.toFixed(1)));
      }
    }, 25);
    return () => clearInterval(timer);
  }, [score]);

  const color = scoreColor(score);

  return (
    <svg width={size} height={size} className="cl-score-ring">
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="10"
      />
      {/* Fill */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.05s linear, stroke 0.3s" }}
      />
      {/* Score text */}
      <text
        x="50%"
        y="44%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="28"
        fontWeight="700"
        fill={color}
      >
        {animScore.toFixed(1)}
      </text>
      <text
        x="50%"
        y="62%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="11"
        fill="#6b7280"
      >
        / 10
      </text>
    </svg>
  );
}

// ─── Animated metric bar ──────────────────────────────────────────────────────
function MetricBar({ label, icon, score }) {
  const [width, setWidth] = useState(0);
  const color = scoreColor(score);

  useEffect(() => {
    const t = setTimeout(() => setWidth(score * 10), 100);
    return () => clearTimeout(t);
  }, [score]);

  return (
    <div className="cl-metric-row">
      <div className="cl-metric-left">
        <span className="cl-metric-icon">{icon}</span>
        <span className="cl-metric-label">{label}</span>
      </div>
      <div className="cl-metric-bar-track">
        <div
          className="cl-metric-bar-fill"
          style={{
            width: `${width}%`,
            background: color,
            transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
      </div>
      <span
        className="cl-metric-score"
        style={{ color }}
      >
        {score?.toFixed ? score.toFixed(1) : score}
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ConfidenceReport({
  result,
  scenario,
  onRetry,
  onRetryScenario,
}) {
  const {
    confidenceScore = 0,
    breakdown = {},
    transcript = "",
    fillerWordCount = 0,
    fillerWordsList = [],
    speakingDurationSeconds = 0,
    dominantEmotion = "neutral",
    aiFeedback = [],
    summary = "",
    speechSpeedWpm = 0,
  } = result;

  const label = scoreLabel(confidenceScore);
  const color = scoreColor(confidenceScore);

  return (
    <div className="cl-wrapper cl-wrapper--report">
      {/* Header */}
      <div className="cl-report-header">
        <button className="cl-back-btn" onClick={onRetry}>
          ← Dashboard
        </button>
        <div className="cl-scenario-chip">
          {scenario?.icon} {scenario?.label}
        </div>
      </div>

      {/* Hero score */}
      <div className="cl-report-hero">
        <div className="cl-report-hero-left">
          <ScoreRing score={confidenceScore} size={160} />
          <div className="cl-report-score-meta">
            <span
              className="cl-report-score-label"
              style={{
                background: `${color}20`,
                color,
                border: `1px solid ${color}40`,
              }}
            >
              {label}
            </span>
            <h2 className="cl-report-title">Confidence Score</h2>
            <p className="cl-report-subtitle">
              {summary || `You completed a ${scenario?.label} session.`}
            </p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="cl-report-stats">
          {[
            {
              icon: "⏱️",
              label: "Duration",
              value: `${speakingDurationSeconds}s`,
            },
            {
              icon: "⚡",
              label: "Speech Speed",
              value: speechSpeedWpm ? `${speechSpeedWpm} WPM` : "—",
            },
            {
              icon: "🗣️",
              label: "Filler Words",
              value: fillerWordCount,
            },
            {
              icon: "🎭",
              label: "Emotion",
              value:
                dominantEmotion.charAt(0).toUpperCase() +
                dominantEmotion.slice(1),
            },
          ].map((stat) => (
            <div key={stat.label} className="cl-stat-card">
              <span className="cl-stat-icon">{stat.icon}</span>
              <span className="cl-stat-value">{stat.value}</span>
              <span className="cl-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Metric breakdown */}
      <div className="cl-report-section">
        <h3 className="cl-section-title">Detailed Breakdown</h3>
        <div className="cl-metrics-list">
          {METRICS.map(({ key, label, icon }) =>
            breakdown[key] !== undefined ? (
              <MetricBar
                key={key}
                label={label}
                icon={icon}
                score={breakdown[key]}
              />
            ) : null
          )}
        </div>
      </div>

      {/* AI Feedback */}
      {aiFeedback.length > 0 && (
        <div className="cl-report-section">
          <h3 className="cl-section-title">
            🤖 AI Coaching Feedback
          </h3>
          <div className="cl-feedback-list">
            {aiFeedback.map((tip, i) => (
              <div key={i} className="cl-feedback-item">
                <span className="cl-feedback-num">{i + 1}</span>
                <p className="cl-feedback-text">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filler words detected */}
      {fillerWordsList.length > 0 && (
        <div className="cl-report-section">
          <h3 className="cl-section-title">🗣️ Filler Words Detected</h3>
          <div className="cl-filler-tags">
            {fillerWordsList.map((word) => (
              <span key={word} className="cl-filler-tag">
                "{word}"
              </span>
            ))}
          </div>
          <p className="cl-filler-hint">
            Found <strong>{fillerWordCount}</strong> filler word
            {fillerWordCount !== 1 ? "s" : ""}. Practice pausing instead of
            using fillers — silence is powerful.
          </p>
        </div>
      )}

      {/* Transcript */}
      {transcript && (
        <div className="cl-report-section">
          <h3 className="cl-section-title">📝 Transcript</h3>
          <div className="cl-transcript-box">
            <p>{transcript}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="cl-report-actions">
        <button className="cl-btn cl-btn--secondary" onClick={onRetry}>
          ← Choose New Scenario
        </button>
        <button className="cl-btn cl-btn--primary" onClick={onRetryScenario}>
          🔄 Retry Same Scenario
        </button>
      </div>
    </div>
  );
}