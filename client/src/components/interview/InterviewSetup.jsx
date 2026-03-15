import { useState } from "react";

const COMPANIES = [
  { name: "Google", tier: "Tier 1", color: "blue", description: "Deep technical + system design" },
  { name: "Microsoft", tier: "Tier 1", color: "blue", description: "Collaborative + growth mindset" },
  { name: "Amazon", tier: "Tier 1", color: "blue", description: "Leadership principles focused" },
  { name: "Razorpay", tier: "Tier 2", color: "indigo", description: "Payments + security focused" },
  { name: "Swiggy", tier: "Tier 2", color: "indigo", description: "Real-world + ops scenarios" },
  { name: "Flipkart", tier: "Tier 2", color: "indigo", description: "Product + scale focused" },
  { name: "Infosys", tier: "Tier 3", color: "gray", description: "Core CS + aptitude based" },
  { name: "TCS", tier: "Tier 3", color: "gray", description: "Fundamentals + communication" },
];

const ROUNDS = [
  {
    id: "core-cs",
    label: "Core CS Round",
    icon: "🖥️",
    desc: "OS, DBMS, CN, OOP fundamentals",
    duration: "20 min",
  },
  {
    id: "dsa",
    label: "DSA Round",
    icon: "🧠",
    desc: "Data structures & algorithm approach",
    duration: "25 min",
  },
  {
    id: "hr",
    label: "HR Round",
    icon: "🤝",
    desc: "Behavioral & situational questions",
    duration: "15 min",
  },
  {
    id: "full-loop",
    label: "Full Interview Loop",
    icon: "🔄",
    desc: "All rounds combined",
    duration: "45 min",
  },
];

const DIFFICULTIES = [
  { id: "fresher", label: "Fresher", desc: "0 experience" },
  { id: "six-months", label: "6 Months", desc: "Intern level" },
  { id: "one-year", label: "1 Year", desc: "Junior level" },
];

const tierColors = {
  "Tier 1": "bg-blue-50 text-blue-700 border border-blue-200",
  "Tier 2": "bg-indigo-50 text-indigo-700 border border-indigo-200",
  "Tier 3": "bg-gray-100 text-gray-600 border border-gray-200",
};

export default function InterviewSetup({ onStart }) {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedRound, setSelectedRound] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState("fresher");

  const canStart = selectedCompany && selectedRound && selectedDifficulty;

  const handleStart = () => {
    if (!canStart) return;
    onStart({
      company: selectedCompany,
      round: selectedRound,
      difficulty: selectedDifficulty,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">AI Mock Interview</h1>
            <p className="text-xs text-gray-500">Personalized by your resume + company data</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-10">
          {["Choose Company", "Select Round", "Set Difficulty"].map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${i === 0 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${i === 0 ? "bg-white text-blue-600" : "bg-gray-300 text-gray-500"}`}>{i + 1}</span>
                {step}
              </div>
              {i < 2 && <div className="w-8 h-px bg-gray-200" />}
            </div>
          ))}
        </div>

        {/* Section 1 — Company */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-semibold">1</span>
            <h2 className="text-base font-semibold text-gray-900">Choose a Company</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {COMPANIES.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedCompany(c.name)}
                className={`group relative p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                  selectedCompany === c.name
                    ? "border-blue-600 bg-blue-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"
                }`}
              >
                {selectedCompany === c.name && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-3 text-lg font-bold text-gray-700">
                  {c.name[0]}
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">{c.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tierColors[c.tier]}`}>
                  {c.tier}
                </span>
                <p className="text-xs text-gray-400 mt-2 leading-tight">{c.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Section 2 — Round */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-semibold">2</span>
            <h2 className="text-base font-semibold text-gray-900">Select Round Type</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {ROUNDS.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRound(r.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                  selectedRound === r.id
                    ? "border-blue-600 bg-blue-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"
                }`}
              >
                <div className="text-2xl mb-3">{r.icon}</div>
                <p className="text-sm font-semibold text-gray-900 mb-1">{r.label}</p>
                <p className="text-xs text-gray-400 mb-2 leading-tight">{r.desc}</p>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{r.duration}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 3 — Difficulty */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-semibold">3</span>
            <h2 className="text-base font-semibold text-gray-900">Set Difficulty Level</h2>
          </div>
          <div className="flex gap-3">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDifficulty(d.id)}
                className={`flex-1 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                  selectedDifficulty === d.id
                    ? "border-blue-600 bg-blue-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-blue-300"
                }`}
              >
                <p className="text-sm font-semibold text-gray-900">{d.label}</p>
                <p className="text-xs text-gray-400">{d.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Summary + Start Button */}
        {canStart && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Company</p>
                <p className="text-sm font-semibold text-gray-900">{selectedCompany}</p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Round</p>
                <p className="text-sm font-semibold text-gray-900">
                  {ROUNDS.find((r) => r.id === selectedRound)?.label}
                </p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Level</p>
                <p className="text-sm font-semibold text-gray-900 capitalize">
                  {DIFFICULTIES.find((d) => d.id === selectedDifficulty)?.label}
                </p>
              </div>
            </div>
            <button
              onClick={handleStart}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-150 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Interview
            </button>
          </div>
        )}

        {!canStart && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-400">
              {!selectedCompany ? "Select a company to continue" : !selectedRound ? "Select a round type" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}