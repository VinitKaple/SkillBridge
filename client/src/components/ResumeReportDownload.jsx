// components/ResumeReportDownload.jsx
// Drop this file into your client/src/components/ folder.
// It renders a hidden, print-ready report and triggers a browser PDF save.
// No extra npm install needed – uses the browser's built-in print / Blob APIs.

import { useRef } from "react";
import { Download } from "lucide-react";

/**
 * Props
 *  result  – the full analysis object returned by /api/analyze-resume
 *  form    – the user's input (cgpa, branch, gradYear, targetRole, backlogs)
 */
export default function ResumeReportDownload({ result, form }) {
  const reportRef = useRef(null);

  const handleDownload = () => {
    const el = reportRef.current;
    if (!el) return;

    // Open a small popup, write the report HTML into it, then trigger print-to-PDF
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) {
      alert("Please allow pop-ups to download the PDF report.");
      return;
    }

    win.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Resume Analysis Report</title>
        <style>
          /* ── Reset & Base ─────────────────────────────────── */
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 13px;
            color: #1e1e2e;
            background: #fff;
            padding: 32px 40px;
          }

          /* ── Header ───────────────────────────────────────── */
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 3px solid #7c3aed;
            padding-bottom: 14px;
            margin-bottom: 24px;
          }
          .header h1 {
            font-size: 22px;
            font-weight: 700;
            color: #7c3aed;
            letter-spacing: -0.5px;
          }
          .header .meta { font-size: 11px; color: #64748b; text-align: right; }

          /* ── Section wrapper ──────────────────────────────── */
          .section {
            margin-bottom: 22px;
            padding: 16px 18px;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
          }
          .section-title {
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            margin-bottom: 12px;
            color: #475569;
          }

          /* ── ATS Score ────────────────────────────────────── */
          .ats-row {
            display: flex;
            align-items: center;
            gap: 18px;
          }
          .ats-score {
            font-size: 52px;
            font-weight: 800;
            color: #7c3aed;
            line-height: 1;
          }
          .ats-bar-wrap { flex: 1; }
          .ats-label { font-size: 11px; color: #94a3b8; margin-bottom: 6px; }
          .bar-bg {
            height: 10px;
            background: #e9d5ff;
            border-radius: 999px;
            overflow: hidden;
          }
          .bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #7c3aed, #a855f7);
            border-radius: 999px;
          }

          /* ── Profile grid ─────────────────────────────────── */
          .profile-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
          }
          .profile-item { }
          .profile-item .label { font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.4px; }
          .profile-item .value { font-size: 13px; font-weight: 600; color: #1e293b; }

          /* ── Pill tags ────────────────────────────────────── */
          .pills { display: flex; flex-wrap: wrap; gap: 6px; }
          .pill {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 500;
          }
          .pill-purple { background: #ede9fe; color: #6d28d9; }
          .pill-yellow { background: #fef9c3; color: #854d0e; }
          .pill-green  { background: #dcfce7; color: #166534; }
          .pill-red    { background: #fee2e2; color: #991b1b; }

          /* ── Company cards ────────────────────────────────── */
          .company-card {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 12px 14px;
            margin-bottom: 10px;
            page-break-inside: avoid;
          }
          .company-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .company-name { font-weight: 700; font-size: 13px; color: #1e293b; }
          .badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 2px 8px;
            border-radius: 999px;
            font-size: 10px;
            font-weight: 600;
          }
          .badge-green { background: #dcfce7; color: #15803d; }
          .badge-gray  { background: #f1f5f9; color: #64748b; }
          .match-score { font-size: 18px; font-weight: 800; color: #7c3aed; }
          .bar-sm { height: 6px; background: #e9d5ff; border-radius: 999px; overflow: hidden; margin-bottom: 8px; }
          .bar-sm-fill { height: 100%; background: #7c3aed; border-radius: 999px; }
          .skills-row { margin-bottom: 6px; }
          .skills-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 4px; }
          .label-green { color: #15803d; }
          .label-red   { color: #dc2626; }
          .eligibility-note { font-size: 10px; color: #64748b; background: #f8fafc; padding: 6px 8px; border-radius: 6px; margin-top: 6px; }

          /* ── Advice ───────────────────────────────────────── */
          .advice-box {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 10px;
            padding: 16px 18px;
          }
          .advice-title { font-weight: 700; color: #15803d; margin-bottom: 8px; font-size: 13px; }
          .advice-text  { color: #374151; line-height: 1.6; font-size: 12px; }

          /* ── Footer ───────────────────────────────────────── */
          .footer {
            margin-top: 32px;
            border-top: 1px solid #e2e8f0;
            padding-top: 10px;
            font-size: 10px;
            color: #94a3b8;
            text-align: center;
          }

          @media print {
            body { padding: 16px 20px; }
            .company-card { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        ${el.innerHTML}
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 800);
          };
        <\/script>
      </body>
      </html>
    `);
    win.document.close();
  };

  if (!result) return null;

  const companiesList = result?.companies || result?.eligibleCompanies || [];
  const date = new Date().toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });

  return (
    <>
      {/* ── Download Button ─────────────────────────────────── */}
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all duration-150"
      >
        <Download size={16} />
        Download PDF Report
      </button>

      {/* ── Hidden report template (rendered off-screen) ─────── */}
      <div className="hidden">
        <div ref={reportRef}>

          {/* Header */}
          <div className="header">
            <h1>Resume Analysis Report</h1>
            <div className="meta">
              <div>Generated: {date}</div>
              {form?.branch && <div>Branch: {form.branch} &nbsp;|&nbsp; CGPA: {form.cgpa}</div>}
              {form?.targetRole && <div>Target Role: {form.targetRole}</div>}
            </div>
          </div>

          {/* ATS Score */}
          <div className="section">
            <div className="section-title">ATS Score</div>
            <div className="ats-row">
              <div className="ats-score">{result.atsScore}</div>
              <div className="ats-bar-wrap">
                <div className="ats-label">out of 100</div>
                <div className="bar-bg">
                  <div className="bar-fill" style={{ width: `${result.atsScore}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Extracted Skills */}
          {result.extractedSkills?.length > 0 && (
            <div className="section">
              <div className="section-title">Extracted Skills ({result.extractedSkills.length})</div>
              <div className="pills">
                {result.extractedSkills.map((s, i) => (
                  <span key={i} className="pill pill-purple">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Companies */}
          {companiesList.length > 0 && (
            <div className="section">
              <div className="section-title">Company Matches ({companiesList.length})</div>
              {companiesList.map((company, idx) => {
                const matchScore = company.matchScore ?? 0;
                const matchedSkills = company.matchedSkills || [];
                const missingSkills = company.missingSkills || [];
                const eligible = company.eligible ?? false;

                return (
                  <div key={idx} className="company-card">
                    <div className="company-header">
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className="company-name">{company.company}</span>
                        <span className={`badge ${eligible ? "badge-green" : "badge-gray"}`}>
                          {eligible ? "✓ Eligible" : "✗ Not Eligible"}
                        </span>
                      </div>
                      <span className="match-score">{matchScore}%</span>
                    </div>
                    <div className="bar-sm">
                      <div className="bar-sm-fill" style={{ width: `${matchScore}%` }}></div>
                    </div>
                    {matchedSkills.length > 0 && (
                      <div className="skills-row">
                        <div className="skills-label label-green">Strengths</div>
                        <div className="pills">
                          {matchedSkills.map((s, i) => <span key={i} className="pill pill-green">{s}</span>)}
                        </div>
                      </div>
                    )}
                    {missingSkills.length > 0 && (
                      <div className="skills-row">
                        <div className="skills-label label-red">Missing Skills</div>
                        <div className="pills">
                          {missingSkills.map((s, i) => <span key={i} className="pill pill-red">{s}</span>)}
                        </div>
                      </div>
                    )}
                    {!eligible && company.minCGPA !== undefined && (
                      <div className="eligibility-note">
                        Criteria: CGPA ≥ {company.minCGPA} &nbsp;|&nbsp; Backlogs ≤ {company.maxBacklogs}
                        {company.branchesAllowed && ` | Branches: ${company.branchesAllowed.join(", ")}`}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* AI Advice */}
          {result.aiAdvice && (
            <div className="advice-box">
              <div className="advice-title">🎯 AI Career Advice</div>
              <div className="advice-text">{result.aiAdvice}</div>
            </div>
          )}

          {/* Footer */}
          <div className="footer">
            This report was automatically generated by the Resume Analyzer. For best results, review suggestions with a career advisor.
          </div>

        </div>
      </div>
    </>
  );
}