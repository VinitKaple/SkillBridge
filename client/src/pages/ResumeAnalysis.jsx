import { useState } from "react";
import { Upload, Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function ResumeAnalyzer() {
  const [form, setForm] = useState({
    cgpa: "",
    backlogs: "",
    branch: "",
    gradYear: "",
    targetRole: "",
  });

  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!file) return setError("Please upload a resume PDF.");
    if (!form.cgpa || !form.branch) return setError("CGPA and Branch are required.");

    setError("");
    setResult(null);
    setLoading(true);

    try {
      const data = new FormData();
      data.append("file", file);
      Object.keys(form).forEach((k) => data.append(k, form[k]));

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/analyze-resume`, {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      console.log("Backend response:", json); // for debugging
      if (!res.ok) throw new Error(json.error || "Analysis failed");
      setResult(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Upload className="text-purple-600" size={28} />
        <h1 className="text-2xl font-bold text-gray-800">Resume Analyzer</h1>
      </div>

      {/* Input Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="CGPA"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
          />
          <input
            type="number"
            placeholder="Backlogs"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(e) => setForm({ ...form, backlogs: e.target.value })}
          />
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(e) => setForm({ ...form, branch: e.target.value })}
          >
            <option value="">Select Branch</option>
            <option>IT</option>
            <option>CS</option>
            <option>CSE</option>
            <option>COMPS</option>
            <option>IOT</option>
            <option>ENTC</option>
            <option>MECH</option>
          </select>
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(e) => setForm({ ...form, gradYear: e.target.value })}
          >
            <option value="">Graduation Year</option>
            <option>2025</option>
            <option>2026</option>
            <option>2027</option>
            <option>2028</option>
            <option>2029</option>
          </select>
          <input
            type="text"
            placeholder="Target Role (optional)"
            className="md:col-span-2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
          />
          <div className="md:col-span-2">
            <input
              type="file"
              accept=".pdf,application/pdf"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading && <Loader2 className="animate-spin w-4 h-4" />}
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          {/* ATS Score & Skills */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">ATS Score</h2>
              <span className="text-3xl font-bold text-purple-600">{result.atsScore}/100</span>
            </div>
            <div className="mt-4">
              <h3 className="font-medium text-gray-700 mb-2">Extracted Skills</h3>
              <div className="flex flex-wrap gap-2">
                {result.extractedSkills?.length > 0 ? (
                  result.extractedSkills.map((skill, i) => (
                    <span key={i} className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No skills extracted.</p>
                )}
              </div>
            </div>
          </div>

          {/* Companies List */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Company Matches</h2>
            {(() => {
              // Support both new (companies) and old (eligibleCompanies) keys
              const companiesList = result.companies || result.eligibleCompanies;

              if (companiesList && companiesList.length > 0) {
                return (
                  <div className="space-y-4">
                    {companiesList.map((company, idx) => {
                      // Normalise fields (old backend may not have all)
                      const matchScore = company.matchScore ?? 0;
                      const matchedSkills = company.matchedSkills || [];
                      const missingSkills = company.missingSkills || [];
                      const eligible = company.eligible ?? false;
                      const minCGPA = company.minCGPA;
                      const maxBacklogs = company.maxBacklogs;
                      const branchesAllowed = company.branchesAllowed;

                      return (
                        <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition">
                          {/* Header */}
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-800">{company.company}</span>
                              {eligible ? (
                                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                                  <CheckCircle size={12} /> Eligible
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                  <XCircle size={12} /> Not Eligible
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-600">Match:</span>
                              <span className="text-lg font-bold text-purple-600">{matchScore}%</span>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${matchScore}%` }}
                            ></div>
                          </div>

                          {/* Strengths */}
                          {matchedSkills.length > 0 && (
                            <div className="mb-2">
                              <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">Strengths</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {matchedSkills.map((skill, i) => (
                                  <span key={i} className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Weaknesses */}
                          {missingSkills.length > 0 && (
                            <div>
                              <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">Missing Skills</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {missingSkills.map((skill, i) => (
                                  <span key={i} className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Eligibility criteria if not eligible and data exists */}
                          {!eligible && minCGPA !== undefined && (
                            <div className="mt-3 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                              <strong>Eligibility criteria:</strong> CGPA ≥ {minCGPA}, Backlogs ≤ {maxBacklogs}, Branches: {branchesAllowed?.join(", ")}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              } else {
                return <p className="text-gray-400 text-sm">No company data available.</p>;
              }
            })()}
          </div>

          {/* AI Advice */}
          <div className="bg-green-50 p-6 rounded-xl border border-green-200">
            <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
              <AlertCircle size={18} /> AI Career Advice
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">{result.aiAdvice}</p>
          </div>
        </div>
      )}
    </div>
  );
}