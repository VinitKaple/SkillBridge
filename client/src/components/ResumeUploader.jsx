// client/src/components/ResumeUploader.jsx
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const STAGES = {
  IDLE: "idle",
  UPLOADING: "uploading",
  ANALYZING: "analyzing",
  GENERATING: "generating",
  DONE: "done",
  ERROR: "error",
};

const STAGE_MESSAGES = {
  [STAGES.UPLOADING]: "Uploading your document...",
  [STAGES.ANALYZING]: "Extracting content from PDF...",
  [STAGES.GENERATING]: "AI is crafting your resume...",
};

export default function ResumeUploader() {
  const [file, setFile] = useState(null);
  const [stage, setStage] = useState(STAGES.IDLE);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadFilename, setDownloadFilename] = useState("Generated_Resume.pdf");
  const [showPreview, setShowPreview] = useState(false);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError("");
    setDownloadUrl(null);
    setShowPreview(false);
    if (rejectedFiles.length > 0) {
      const reason = rejectedFiles[0].errors[0];
      if (reason.code === "file-too-large") setError("File is too large. Maximum size is 10 MB.");
      else if (reason.code === "file-invalid-type") setError("Only PDF files are accepted.");
      else setError("Invalid file. Please upload a PDF.");
      return;
    }
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setStage(STAGES.IDLE);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleGenerate = async () => {
  if (!file) return;
  setError("");
  setProgress(0);
  setDownloadUrl(null);
  setShowPreview(false);

  const formData = new FormData();
  formData.append("resume", file);

  try {
    setStage(STAGES.UPLOADING);

    const t1 = setTimeout(() => { setStage(STAGES.ANALYZING); setProgress(30); }, 800);
    const t2 = setTimeout(() => { setStage(STAGES.GENERATING); setProgress(65); }, 3000);

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/resume/generate`, // ✅ full backend URL
      formData,
      {
        responseType: "blob",
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / e.total);
          if (pct < 30) setProgress(pct);
        },
      }
    );

    clearTimeout(t1);
    clearTimeout(t2);
    setProgress(100);
    setStage(STAGES.DONE);

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    setDownloadUrl(url);

    const disposition = response.headers["content-disposition"];
    let filename = "Generated_Resume.pdf";
    if (disposition) {
      const match = disposition.match(/filename="?([^"]+)"?/);
      if (match) filename = match[1];
    }
    setDownloadFilename(filename);

  } catch (err) {
    setStage(STAGES.ERROR);
    if (err.response?.data instanceof Blob) {
      try {
        const text = await err.response.data.text();
        const json = JSON.parse(text);
        setError(json.message || "Something went wrong. Please try again.");
      } catch { setError("Resume generation failed. Please try again."); }
    } else {
      setError(err.message || "Resume generation failed. Please try again.");
    }
  }
};

  const handleDownload = () => {
    if (!downloadUrl) return;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = downloadFilename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleReset = () => {
    if (downloadUrl) window.URL.revokeObjectURL(downloadUrl);
    setFile(null);
    setStage(STAGES.IDLE);
    setError("");
    setProgress(0);
    setDownloadUrl(null);
    setShowPreview(false);
  };

  const isProcessing = [STAGES.UPLOADING, STAGES.ANALYZING, STAGES.GENERATING].includes(stage);
  const isDone = stage === STAGES.DONE;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-8 space-y-5">

        {/* ── Dropzone ── */}
        {!isDone && (
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
              transition-all duration-200 select-none
              ${isDragActive && !isDragReject ? "border-black bg-gray-50"
                : isDragReject             ? "border-red-400 bg-red-50"
                : file                     ? "border-green-400 bg-green-50"
                : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"}
              ${isProcessing ? "pointer-events-none opacity-60" : ""}
            `}
          >
            <input {...getInputProps()} />
            {file ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB · PDF</p>
                </div>
                {!isProcessing && (
                  <button onClick={(e) => { e.stopPropagation(); handleReset(); }}
                    className="text-xs text-gray-400 hover:text-red-500 underline transition-colors">
                    Remove file
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors
                  ${isDragActive ? "bg-gray-900" : "bg-gray-100"}`}>
                  <svg className={`w-7 h-7 ${isDragActive ? "text-white" : "text-gray-400"}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {isDragActive ? "Drop your PDF here" : "Drag & drop your PDF here"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    or <span className="text-black font-medium underline underline-offset-2">browse files</span>
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap justify-center">
                  {["Resume", "Project Report", "Skills Document"].map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* ── Progress ── */}
        {isProcessing && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{STAGE_MESSAGES[stage]}</span>
              <span className="text-sm text-gray-500">{progress}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-black rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }} />
            </div>
            <div className="flex items-center gap-2 mt-3">
              {[0, 150, 300].map((delay) => (
                <div key={delay} className="w-1.5 h-1.5 bg-black rounded-full animate-bounce"
                  style={{ animationDelay: `${delay}ms` }} />
              ))}
              <span className="text-xs text-gray-400 ml-1">This may take 15–30 seconds</span>
            </div>
          </div>
        )}

        {/* ── Generate Button ── */}
        {!isDone && (
          <button
            onClick={handleGenerate}
            disabled={!file || isProcessing}
            className={`
              w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide
              transition-all duration-200 flex items-center justify-center gap-2
              ${!file || isProcessing
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800 active:scale-[0.99]"}
            `}
          >
            {isProcessing ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {STAGE_MESSAGES[stage]}
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Analyze &amp; Generate Resume
              </>
            )}
          </button>
        )}

        {/* ══════════════════════════════════════
            SUCCESS STATE — Preview + Actions
        ══════════════════════════════════════ */}
        {isDone && downloadUrl && (
          <div className="space-y-4">

            {/* Success Banner */}
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-green-800">Resume generated successfully!</p>
                <p className="text-xs text-green-600 mt-0.5 truncate">{downloadFilename}</p>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="grid grid-cols-3 gap-3">
              {/* Preview Toggle */}
              <button
                onClick={() => setShowPreview((v) => !v)}
                className={`flex flex-col items-center justify-center gap-1.5 py-4 rounded-xl border-2 font-medium text-xs transition-all
                  ${showPreview
                    ? "border-black bg-black text-white"
                    : "border-gray-200 text-gray-600 hover:border-gray-400"}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {showPreview ? "Hide" : "Preview"}
              </button>

              {/* Download */}
              <button
                onClick={handleDownload}
                className="flex flex-col items-center justify-center gap-1.5 py-4 rounded-xl bg-black text-white font-medium text-xs hover:bg-gray-800 transition-all active:scale-[0.98]"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>

              {/* New Resume */}
              <button
                onClick={handleReset}
                className="flex flex-col items-center justify-center gap-1.5 py-4 rounded-xl border-2 border-gray-200 text-gray-600 font-medium text-xs hover:border-gray-400 transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                New Resume
              </button>
            </div>

            {/* PDF Preview iframe — toggled */}
            {showPreview && (
              <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-gray-400 font-mono">{downloadFilename}</span>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <iframe
                  src={downloadUrl}
                  title="Resume Preview"
                  className="w-full"
                  style={{ height: "700px" }}
                />
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}