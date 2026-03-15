import React from 'react';
import ResumeUploader from "../components/ResumeUploader";

export default function ResumeDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">AI Resume Generator</h1>
          </div>
          <p className="text-gray-500 text-sm ml-11">
            Upload your resume, project report, or skill document — get an ATS-optimized resume in seconds.
          </p>
        </div>
      </div>

      {/* Main Content Section */}
      
      <main className="flex-1 max-w-4xl mx-auto w-full p-2">
              <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-5">
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { step: "01", title: "Upload Document", desc: "Drop your resume, project report, or skills doc" },
            { step: "02", title: "AI Analyzes", desc: "GPT-4 extracts and structures your experience" },
            { step: "03", title: "Download Resume", desc: "Get a polished, ATS-friendly PDF ready to send" },
          ].map((item) => (
            <div key={item.step} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="text-xs font-mono font-bold text-gray-300 mb-2">{item.step}</div>
              <div className="font-semibold text-gray-900 text-sm mb-1">{item.title}</div>
              <div className="text-gray-500 text-xs leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
        <ResumeUploader />
        <p className="text-center text-xs text-gray-400 mt-6">
          Supports PDF files up to 10MB · Resume, project reports, skill documents all accepted
        </p>
      </div>
      </main>

      {/* Optional Footer */}
      <footer className="py-8 text-center text-gray-400 text-xs">
        Powered by SkillBridge AI • Secure PDF Processing
      </footer>
    </div>
  );
}