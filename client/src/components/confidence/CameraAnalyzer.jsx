// client/src/components/confidence/CameraAnalyzer.jsx
// ConfidenceLens AI – REBUILT: Full live indicators, real-time transcript,
// hand movement detection, always-visible stop button, fixed API endpoint

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as faceapi from "face-api.js";
import "./confidence.css";

const MIN_DURATION = 20;
const MAX_DURATION = 60;
const MODELS_PATH = "/models";

const FILLER_WORDS = [
  "um",
  "uh",
  "like",
  "you know",
  "so",
  "basically",
  "literally",
  "actually",
  "right",
  "okay",
  "hmm",
];

const getDominant = (expressions) => {
  if (!expressions) return "neutral";
  return (
    Object.entries(expressions).sort((a, b) => b[1] - a[1])[0]?.[0] || "neutral"
  );
};

const EMOTION_EMOJI = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  fearful: "😨",
  disgusted: "🤢",
  surprised: "😮",
  neutral: "😐",
};

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function highlightFillers(text) {
  if (!text) return null;
  const parts = text.split(
    new RegExp(`\\b(${FILLER_WORDS.join("|")})\\b`, "gi"),
  );
  return parts.map((part, i) =>
    FILLER_WORDS.includes(part.toLowerCase()) ? (
      <mark key={i} className="cl-filler-mark">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

function LiveIndicator({ label, icon, value, good, bad }) {
  const status = value === null ? "unknown" : value ? "good" : "bad";
  const cfg = {
    good: {
      bg: "#dcfce7",
      border: "#22c55e",
      text: "#15803d",
      dot: "#22c55e",
      msg: good,
    },
    bad: {
      bg: "#fee2e2",
      border: "#ef4444",
      text: "#dc2626",
      dot: "#ef4444",
      msg: bad,
    },
    unknown: {
      bg: "#f3f4f6",
      border: "#d1d5db",
      text: "#6b7280",
      dot: "#9ca3af",
      msg: "Detecting…",
    },
  }[status];
  return (
    <div
      className="cl-live-ind"
      style={{ background: cfg.bg, borderColor: cfg.border }}
    >
      <span className="cl-live-ind-icon">{icon}</span>
      <div className="cl-live-ind-content">
        <span className="cl-live-ind-label" style={{ color: cfg.text }}>
          {label}
        </span>
        <span className="cl-live-ind-msg" style={{ color: cfg.text }}>
          {cfg.msg}
        </span>
      </div>
      <span
        className="cl-live-ind-dot"
        style={{ background: cfg.dot, boxShadow: `0 0 6px ${cfg.dot}` }}
      />
    </div>
  );
}

export default function CameraAnalyzer({ scenario, onComplete, onCancel }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const detectRef = useRef(null);
  const timerRef = useRef(null);
  const srRef = useRef(null);
  const elapsedRef = useRef(0);
  const faceDataRef = useRef({
    totalFrames: 0,
    eyeFrames: 0,
    forwardFrames: 0,
    expressions: {},
  });
  const motionRef = useRef({ prev: null, total: 0, samples: 0 });

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [live, setLive] = useState({
    eyeContact: null,
    faceForward: null,
    expression: null,
    handMovement: null,
    faceDetected: false,
    emotion: "neutral",
    speechConf: 0,
    movementPct: 0,
  });

  // Load models
  useEffect(() => {
    (async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODELS_PATH),
          faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODELS_PATH),
          faceapi.nets.faceExpressionNet.loadFromUri(MODELS_PATH),
        ]);
        setModelsLoaded(true);
      } catch (e) {
        console.warn("face-api models failed:", e.message);
      }
    })();
  }, []);

  // Init camera
  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" },
          audio: { echoCancellation: true, noiseSuppression: true },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraReady(true);
        }
      } catch (e) {
        setError(
          "Camera/mic access denied. Please allow permissions and refresh.",
        );
      }
    })();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      clearInterval(detectRef.current);
      clearInterval(timerRef.current);
      try {
        srRef.current?.stop();
      } catch (_) {}
    };
  }, []);

  // Motion detection
  const detectMotion = useCallback(() => {
    const v = videoRef.current;
    if (!v || v.readyState < 2) return 0;
    const c = document.createElement("canvas");
    c.width = 80;
    c.height = 60;
    const ctx = c.getContext("2d");
    ctx.drawImage(v, 0, 0, 80, 60);
    const px = ctx.getImageData(0, 0, 80, 60).data;
    let diff = 0;
    if (motionRef.current.prev) {
      const p = motionRef.current.prev;
      for (let i = 0; i < px.length; i += 4)
        diff +=
          Math.abs(px[i] - p[i]) +
          Math.abs(px[i + 1] - p[i + 1]) +
          Math.abs(px[i + 2] - p[i + 2]);
      diff /= px.length / 4;
    }
    motionRef.current.prev = new Uint8ClampedArray(px);
    motionRef.current.total += diff;
    motionRef.current.samples++;
    return diff;
  }, []);

  // Face detection loop
  const startDetection = useCallback(() => {
    detectRef.current = setInterval(async () => {
      const v = videoRef.current,
        c = canvasRef.current;
      if (!v || !c || v.readyState < 2) return;

      const motion = detectMotion();
      const hasMotion = motion > 10;

      if (!modelsLoaded) {
        setLive((p) => ({
          ...p,
          handMovement: hasMotion,
          movementPct: Math.min(100, motion * 4),
        }));
        return;
      }

      try {
        const dims = faceapi.matchDimensions(c, v, true);
        const det = await faceapi
          .detectSingleFace(
            v,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 224,
              scoreThreshold: 0.4,
            }),
          )
          .withFaceLandmarks(true)
          .withFaceExpressions();

        const ctx = c.getContext("2d");
        ctx.clearRect(0, 0, c.width, c.height);

        if (!det) {
          faceDataRef.current.totalFrames++;
          setLive((p) => ({
            ...p,
            faceDetected: false,
            eyeContact: false,
            faceForward: false,
            handMovement: hasMotion,
            movementPct: Math.min(100, motion * 4),
          }));
          // Red dashed box
          ctx.strokeStyle = "#ef4444";
          ctx.lineWidth = 2;
          ctx.setLineDash([8, 4]);
          ctx.strokeRect(
            dims.width * 0.25,
            dims.height * 0.1,
            dims.width * 0.5,
            dims.height * 0.8,
          );
          ctx.setLineDash([]);
          ctx.fillStyle = "rgba(239,68,68,0.08)";
          ctx.fillRect(
            dims.width * 0.25,
            dims.height * 0.1,
            dims.width * 0.5,
            dims.height * 0.8,
          );
          ctx.fillStyle = "#ef4444";
          ctx.font = "bold 13px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(
            "⚠ Position your face here",
            dims.width / 2,
            dims.height * 0.09,
          );
          return;
        }

        faceDataRef.current.totalFrames++;
        const { detection, landmarks, expressions } = faceapi.resizeResults(
          det,
          dims,
        );
        const box = detection.box;

        // Eye contact
        const cx = box.x + box.width / 2,
          cy = box.y + box.height / 2;
        const horizOff = Math.abs(cx - dims.width / 2) / (dims.width / 2);
        const isEye = horizOff < 0.28;
        if (isEye) faceDataRef.current.eyeFrames++;

        // Face forward
        const nose = landmarks.getNose()[3];
        const noseOff = Math.abs(nose.x - cx) / (box.width / 2);
        const isForward = noseOff < 0.35;
        if (isForward) faceDataRef.current.forwardFrames++;

        // Expressions
        Object.entries(expressions).forEach(([k, v]) => {
          faceDataRef.current.expressions[k] =
            (faceDataRef.current.expressions[k] || 0) + v;
        });
        const dominant = getDominant(expressions);
        const goodExpr = ["happy", "surprised", "neutral"].includes(dominant);

        const speechConf = Math.round(
          40 +
            (isEye ? 25 : 0) +
            (isForward ? 15 : 0) +
            (goodExpr ? 15 : 0) +
            (hasMotion ? 5 : 0),
        );

        setLive({
          faceDetected: true,
          eyeContact: isEye,
          faceForward: isForward,
          expression: goodExpr,
          handMovement: hasMotion,
          emotion: dominant,
          speechConf,
          movementPct: Math.min(100, motion * 4),
        });

        // ── Canvas drawing ──────────────────────────────────────────────────
        const ringColor = isEye ? "#22c55e" : "#ef4444";
        const rx = box.width / 2 + 14,
          ry = box.height / 2 + 14;

        // Glow ring
        ctx.save();
        ctx.shadowBlur = 22;
        ctx.shadowColor = ringColor;
        ctx.strokeStyle = ringColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Corner brackets
        [
          [box.x, box.y],
          [box.x + box.width, box.y],
          [box.x, box.y + box.height],
          [box.x + box.width, box.y + box.height],
        ].forEach(([px, py]) => {
          const dx = px < cx ? 16 : -16,
            dy = py < cy ? 16 : -16;
          ctx.strokeStyle = ringColor;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(px, py + dy);
          ctx.lineTo(px, py);
          ctx.lineTo(px + dx, py);
          ctx.stroke();
        });

        // Eye contact label
        ctx.fillStyle = ringColor;
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          isEye ? "✓ Eye Contact" : "✗ Look at Camera",
          cx,
          box.y - 8,
        );

        // Hand movement badge
        if (hasMotion) {
          ctx.save();
          ctx.shadowBlur = 14;
          ctx.shadowColor = "#22c55e";
          ctx.fillStyle = "rgba(34,197,94,0.2)";
          ctx.strokeStyle = "#22c55e";
          ctx.lineWidth = 2;
          const hw = 140,
            hh = 28,
            hx = dims.width - hw - 10,
            hy = dims.height - hh - 44;
          roundRect(ctx, hx, hy, hw, hh, 6);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
          ctx.fillStyle = "#22c55e";
          ctx.font = "bold 12px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("🤲 Hand Movement ✓", hx + hw / 2, hy + 18);
        }

        // Emotion badge
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        roundRect(ctx, dims.width - 130, 10, 120, 30, 8);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "13px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          `${EMOTION_EMOJI[dominant] || "😐"} ${dominant.charAt(0).toUpperCase() + dominant.slice(1)}`,
          dims.width - 70,
          30,
        );

        // Speech confidence bar on canvas (top)
        const barW = Math.round((speechConf / 100) * dims.width * 0.6);
        const barX = (dims.width - dims.width * 0.6) / 2;
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        roundRect(ctx, barX, 8, dims.width * 0.6, 12, 6);
        ctx.fill();
        ctx.fillStyle =
          speechConf > 70 ? "#22c55e" : speechConf > 45 ? "#f59e0b" : "#ef4444";
        roundRect(ctx, barX, 8, barW, 12, 6);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`🎙️ Confidence ${speechConf}%`, dims.width / 2, 18);
      } catch (_) {
        /* silent */
      }
    }, 150);
  }, [modelsLoaded, detectMotion]);

  // Speech recognition
  const startSR = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.continuous = true;
    r.interimResults = true;
    r.lang = "en-US";
    r.onresult = (e) => {
      let fin = "";
      for (let i = e.resultIndex; i < e.results.length; i++)
        if (e.results[i].isFinal) fin += e.results[i][0].transcript + " ";
      if (fin) setTranscript((p) => (p + fin).slice(-500));
    };
    r.onend = () => {
      try {
        if (recorderRef.current?.state === "recording") r.start();
      } catch (_) {}
    };
    try {
      r.start();
      srRef.current = r;
    } catch (e) {}
  }, []);

  // Start recording
  const startRecording = useCallback(() => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    faceDataRef.current = {
      totalFrames: 0,
      eyeFrames: 0,
      forwardFrames: 0,
      expressions: {},
    };
    motionRef.current = { prev: null, total: 0, samples: 0 };
    setTranscript("");
    setElapsed(0);
    elapsedRef.current = 0;

    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";

    const rec = new MediaRecorder(
      new MediaStream(streamRef.current.getAudioTracks()),
      { mimeType },
    );
    rec.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    rec.start(500);
    recorderRef.current = rec;
    setIsRecording(true);

    timerRef.current = setInterval(() => {
      elapsedRef.current++;
      setElapsed(elapsedRef.current);
      if (elapsedRef.current >= MAX_DURATION) handleStopAndAnalyze();
    }, 1000);

    startDetection();
    startSR();
  }, [startDetection, startSR]);

  // Stop & analyze
  const handleStopAndAnalyze = useCallback(async () => {
    if (!recorderRef.current || recorderRef.current.state === "inactive")
      return;
    clearInterval(timerRef.current);
    clearInterval(detectRef.current);
    try {
      srRef.current?.stop();
    } catch (_) {}

    await new Promise((res) => {
      recorderRef.current.onstop = res;
      recorderRef.current.stop();
    });
    setIsRecording(false);
    setUploading(true);

    try {
      const blob = new Blob(chunksRef.current, {
        type: recorderRef.current?.mimeType || "audio/webm",
      });
      const fd = faceDataRef.current;
      const faceData = {
        eyeContactRatio:
          fd.totalFrames > 0 ? fd.eyeFrames / fd.totalFrames : 0.5,
        faceDirectionRatio:
          fd.totalFrames > 0 ? fd.forwardFrames / fd.totalFrames : 0.5,
        expressionData:
          fd.totalFrames > 0
            ? Object.fromEntries(
                Object.entries(fd.expressions).map(([k, v]) => [
                  k,
                  v / fd.totalFrames,
                ]),
              )
            : {},
        handMovementScore:
          motionRef.current.samples > 0
            ? Math.min(
                10,
                motionRef.current.total / motionRef.current.samples / 3,
              )
            : 5,
      };

      const form = new FormData();
      form.append("audio", blob, "recording.webm");
      form.append("scenario", scenario.id);
      form.append("duration", String(elapsedRef.current));
      form.append("faceData", JSON.stringify(faceData));
      const base = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const res = await fetch(`${base}/api/confidence/analyze`, {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(`Server ${res.status}: ${t.substring(0, 120)}`);
      }
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Analysis failed");
      onComplete(json.data);
    } catch (err) {
      console.error("[CameraAnalyzer]", err);
      setError(`Analysis failed: ${err.message}`);
      setUploading(false);
    }
  }, [scenario, onComplete]);

  const progressPct = Math.min(100, (elapsed / MAX_DURATION) * 100);
  const canStop = elapsed >= MIN_DURATION;
  const progressColor =
    elapsed < MIN_DURATION ? "#f59e0b" : elapsed < 45 ? "#22c55e" : "#ef4444";

  // ── Error ──
  if (error)
    return (
      <div className="cl-wrapper">
        <div className="cl-error-card">
          <span className="cl-error-icon">⚠️</span>
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <button className="cl-btn cl-btn--primary" onClick={onCancel}>
            Go Back
          </button>
        </div>
      </div>
    );

  // ── Uploading ──
  if (uploading)
    return (
      <div className="cl-wrapper">
        <div className="cl-uploading-screen">
          <div className="cl-upload-spinner" />
          <h3>Analyzing your session…</h3>
          <p>This takes 10–20 seconds. Please wait.</p>
          <div className="cl-upload-steps">
            {[
              "🎙️ Transcribing audio (Whisper)",
              "🧠 Detecting emotion (HuggingFace)",
              "📊 Scoring confidence (GPT-4o-mini)",
            ].map((s, i) => (
              <div key={i} className="cl-upload-step">
                <span
                  className="cl-upload-step-dot"
                  style={{ animationDelay: `${i * 0.5}s` }}
                />
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  // ── Main ──
  return (
    <div className="cl-cam-root">
      {/* Topbar */}
      <div className="cl-cam-topbar">
        <button
          className="cl-back-btn"
          onClick={onCancel}
          disabled={isRecording}
        >
          ← Back
        </button>
        <div className="cl-scenario-chip">
          {scenario.icon} {scenario.label}
        </div>
        {isRecording && (
          <div className="cl-rec-badge">
            <span className="cl-rec-dot" /> REC {elapsed}s / {MAX_DURATION}s
          </div>
        )}
      </div>

      <div className="cl-cam-body">
        {/* LEFT: camera + transcript + controls */}
        <div className="cl-cam-left">
          <div className="cl-camera-area">
            {!cameraReady && (
              <div className="cl-camera-loading">
                <div className="cl-spinner" />
                <p>
                  {modelsLoaded ? "Starting camera…" : "Loading AI models…"}
                </p>
              </div>
            )}
            <video
              ref={videoRef}
              className="cl-video"
              muted
              playsInline
              style={{ opacity: cameraReady ? 1 : 0 }}
            />
            <canvas ref={canvasRef} className="cl-canvas" />

            {/* Progress bar overlay at bottom of video */}
            {isRecording && (
              <div className="cl-vid-progress">
                <div
                  className="cl-vid-progress-fill"
                  style={{
                    width: `${progressPct}%`,
                    background: progressColor,
                  }}
                />
                <span className="cl-vid-progress-label">
                  {!canStop
                    ? `🗣️ Keep speaking… ${MIN_DURATION - elapsed}s to go`
                    : `✅ ${MAX_DURATION - elapsed}s remaining`}
                </span>
              </div>
            )}
          </div>

          {/* Live transcript */}
          {isRecording && (
            <div className="cl-transcript-live">
              <div className="cl-transcript-live-header">
                <span className="cl-rec-dot" /> Live Transcript
                {!transcript && (
                  <span className="cl-transcript-note">(Chrome/Edge only)</span>
                )}
              </div>
              <p className="cl-transcript-live-text">
                {transcript ? (
                  highlightFillers(transcript)
                ) : (
                  <span className="cl-transcript-placeholder">
                    Start speaking — your words will appear here in real time…
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Controls */}
          <div className="cl-cam-controls">
            {!isRecording ? (
              <div className="cl-start-area">
                <p className="cl-start-hint">
                  📌 Speak clearly · Look at camera · Fill the frame · Use hand
                  gestures
                </p>
                <button
                  className="cl-btn cl-btn--record"
                  onClick={startRecording}
                  disabled={!cameraReady}
                >
                  <span className="cl-rec-dot cl-rec-dot--lg" /> Start Recording
                </button>
              </div>
            ) : (
              <button
                className={`cl-btn ${canStop ? "cl-btn--stop" : "cl-btn--stop-wait"}`}
                onClick={handleStopAndAnalyze}
                disabled={!canStop}
              >
                {canStop
                  ? "⏹ Stop & Get AI Report"
                  : `🗣️ Keep speaking… ${MIN_DURATION - elapsed}s more`}
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: live indicators panel — always visible during recording */}
        {isRecording && (
          <div className="cl-indicators-panel">
            <h4 className="cl-indicators-title">📡 Live Analysis</h4>

            <div
              className={`cl-ind-status ${live.faceDetected ? "cl-ind-status--ok" : "cl-ind-status--bad"}`}
            >
              {live.faceDetected ? "✓ Face Detected" : "⚠ No Face in Frame"}
            </div>

            <LiveIndicator
              label="Eye Contact"
              icon="👁️"
              value={live.eyeContact}
              good="Looking at camera"
              bad="Look at camera lens"
            />
            <LiveIndicator
              label="Face Forward"
              icon="🎯"
              value={live.faceForward}
              good="Facing forward"
              bad="Turn toward camera"
            />
            <LiveIndicator
              label="Expression"
              icon="😊"
              value={live.expression}
              good="Positive expression"
              bad="Show more expression"
            />
            <LiveIndicator
              label="Hand Movement"
              icon="🤲"
              value={live.handMovement}
              good="Gestures detected ✓"
              bad="Try hand gestures"
            />

            {/* Emotion */}
            <div className="cl-ind-emotion">
              <span className="cl-ind-emotion-emoji">
                {EMOTION_EMOJI[live.emotion] || "😐"}
              </span>
              <div>
                <div className="cl-ind-emotion-label">Detected Emotion</div>
                <div className="cl-ind-emotion-val">
                  {live.emotion?.charAt(0).toUpperCase() +
                    live.emotion?.slice(1)}
                </div>
              </div>
            </div>

            {/* Speech confidence bar */}
            <div className="cl-ind-speech">
              <div className="cl-ind-speech-header">
                <span>🎙️ Speech Confidence</span>
                <span className="cl-ind-speech-pct">{live.speechConf}%</span>
              </div>
              <div className="cl-ind-speech-track">
                <div
                  className="cl-ind-speech-fill"
                  style={{
                    width: `${live.speechConf}%`,
                    background:
                      live.speechConf > 70
                        ? "#22c55e"
                        : live.speechConf > 45
                          ? "#f59e0b"
                          : "#ef4444",
                  }}
                />
              </div>
            </div>

            {/* Body movement bar */}
            <div className="cl-ind-speech">
              <div className="cl-ind-speech-header">
                <span>🤲 Body Movement</span>
                <span
                  className="cl-ind-speech-pct"
                  style={{
                    color: live.movementPct > 20 ? "#22c55e" : "#9ca3af",
                  }}
                >
                  {live.movementPct > 20 ? "Active" : "Still"}
                </span>
              </div>
              <div className="cl-ind-speech-track">
                <div
                  className="cl-ind-speech-fill"
                  style={{
                    width: `${Math.min(100, live.movementPct)}%`,
                    background: live.movementPct > 20 ? "#22c55e" : "#d1d5db",
                    transition: "width 0.15s ease",
                  }}
                />
              </div>
            </div>

            {/* Contextual tips */}
            <div className="cl-ind-tips">
              {live.eyeContact && (
                <div className="cl-tip cl-tip--good">✓ Great eye contact!</div>
              )}
              {!live.eyeContact && live.faceDetected && (
                <div className="cl-tip cl-tip--bad">
                  👁️ Look at the camera lens
                </div>
              )}
              {!live.faceDetected && (
                <div className="cl-tip cl-tip--bad">
                  📷 Move closer to fill the frame
                </div>
              )}
              {live.handMovement && (
                <div className="cl-tip cl-tip--good">
                  ✓ Good use of gestures!
                </div>
              )}
              {!live.handMovement && live.faceDetected && (
                <div className="cl-tip cl-tip--warn">
                  🤲 Use hand gestures to look confident
                </div>
              )}
              {live.speechConf > 75 && (
                <div className="cl-tip cl-tip--good">
                  🔥 Excellent confidence!
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
