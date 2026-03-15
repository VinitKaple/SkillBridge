import { useState } from "react";
import {
  CheckCircle, XCircle, Zap, Shield, ChevronRight,
  ArrowUpRight, Plus, Trash2, Edit2, Building2,
  Users, BookOpen, BarChart3, Megaphone, Save,
  GraduationCap, MapPin, Award, TrendingUp, Bell,
  Target, FileText, Cpu, Star
} from "lucide-react";

// ─── Subscription Plans ────────────────────────────────────────────────────────

function SubscriptionSection() {
  const [billing, setBilling] = useState("monthly");

  const standardPrice = billing === "annual" ? "₹699" : "₹999";
  const advancedPrice = billing === "annual" ? "₹2,099" : "₹2,999";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pt-2">
        <h2 className="text-2xl font-bold text-gray-900">Subscription Plans</h2>
        <p className="text-sm text-gray-400 mt-1">
          Upgrade to unlock AI-powered placement intelligence
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 mt-5">
          <span className={`text-sm font-medium transition-colors ${billing === "monthly" ? "text-gray-900" : "text-gray-400"}`}>
            Monthly
          </span>
          <button
            onClick={() => setBilling(b => b === "monthly" ? "annual" : "monthly")}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${billing === "annual" ? "bg-blue-600" : "bg-gray-200"}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${billing === "annual" ? "translate-x-6" : "translate-x-0.5"}`} />
          </button>
          <span className={`text-sm font-medium transition-colors ${billing === "annual" ? "text-gray-900" : "text-gray-400"}`}>
            Annual{" "}
            <span className="text-green-600 font-semibold text-xs bg-green-50 px-2 py-0.5 rounded-full ml-1">
              Save 30%
            </span>
          </span>
        </div>
      </div>

      {/* Current Plan Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
        <Shield className="w-5 h-5 text-amber-500 shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-800">You are on the Standard Plan</p>
          <p className="text-xs text-amber-600 mt-0.5">
            Upgrade to Advanced to unlock AI features and unlimited access
          </p>
        </div>
        <span className="text-xs font-bold bg-amber-200 text-amber-800 px-3 py-1.5 rounded-full shrink-0">
          Current
        </span>
      </div>

      {/* Two Plans */}
      <div className="grid grid-cols-2 gap-5">

        {/* Standard */}
        <div className="bg-white rounded-3xl border-2 border-gray-200 p-6">
          <div className="mb-5">
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Current Plan
            </span>
            <h3 className="text-xl font-bold text-gray-900 mt-3">Standard</h3>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-4xl font-bold text-gray-900">{standardPrice}</span>
              <span className="text-sm text-gray-400">/mo</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">For small colleges getting started</p>
          </div>

          <div className="space-y-3 mb-6">
            {[
{ f: "Resume Analysis", ok: true },
{ f: "Resume Builder", ok: true },
{ f: "Mock Preparation", ok: true },
{ f: "Up to 20 companies", ok: true },
{ f: "500 student profiles", ok: true },
{ f: "Basic placement analytics", ok: true },
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-2.5 text-sm ${item.ok ? "text-gray-700" : "text-gray-300"}`}>
                {item.ok
                  ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  : <XCircle className="w-4 h-4 text-gray-200 shrink-0" />
                }
                {item.f}
              </div>
            ))}
          </div>

          <button className="w-full py-3 rounded-2xl border-2 border-gray-200 text-sm font-semibold text-gray-400 cursor-not-allowed">
            Active Plan
          </button>
        </div>

        {/* Advanced — Featured */}
        <div className="bg-white rounded-3xl border-2 border-blue-500 p-6 relative shadow-lg">
          {/* Most Popular Badge */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <span className="bg-blue-600 text-white text-xs font-bold px-5 py-2 rounded-full shadow-md flex items-center gap-1.5 whitespace-nowrap">
              <Zap className="w-3.5 h-3.5 text-yellow-300" />
              Most Popular
            </span>
          </div>

          <div className="mb-5 mt-2">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Recommended
            </span>
            <h3 className="text-xl font-bold text-gray-900 mt-3">Advanced</h3>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-4xl font-bold text-blue-600">{advancedPrice}</span>
              <span className="text-sm text-gray-400">/mo</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">For colleges serious about placements</p>
          </div>

          <div className="space-y-3 mb-6">
            {[
{ f: "Resume Analysis", ok: true },
{ f: "Resume Builder", ok: true },
{ f: "Mock Preparation", ok: true },
{ f: "Unlimited companies", ok: true },
{ f: "Unlimited students", ok: true },
{ f: "Custom analytics dashboard", ok: true },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />
                {item.f}
              </div>
            ))}
          </div>

          <button className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2">
            Upgrade Now <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Why Upgrade Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-5 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-yellow-300" />
          <h3 className="text-base font-bold">Why upgrade to Advanced?</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: <Target className="w-4 h-4" />, title: "AI Placement Prediction", desc: "Predict which students get placed before drives begin" },
            { icon: <BarChart3 className="w-4 h-4" />, title: "Skill Gap Intelligence", desc: "Know exactly what skills your batch needs per company" },
            { icon: <Star className="w-4 h-4" />, title: "Mock Interview Insights", desc: "See how your students perform in AI mock interviews" },
          ].map((f, i) => (
            <div key={i} className="bg-white/10 rounded-2xl p-3">
              <div className="flex items-center gap-2 mb-1.5 text-yellow-300">
                {f.icon}
                <span className="text-xs font-bold text-white">{f.title}</span>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TNP Control Panel ─────────────────────────────────────────────────────────

// Mock data for companies
const INIT_COMPANIES = [
  { id: 1, name: "Google", role: "SDE-1", ctc: "24", skills: "DSA, System Design, Python", branches: "CS, IT", year: "2025", status: "confirmed" },
  { id: 2, name: "Microsoft", role: "SDE-1", ctc: "19", skills: "DSA, OOP, Azure", branches: "CS, IT, ECE", year: "2025", status: "confirmed" },
  { id: 3, name: "Infosys", role: "Systems Eng", ctc: "4.5", skills: "Java, SQL, Communication", branches: "ALL", year: "2025", status: "confirmed" },
];

const INIT_ANNOUNCEMENTS = [
  { id: 1, title: "Infosys Registration Open", body: "Registration closes on March 25, 2026.", tag: "NEW" },
  { id: 2, title: "Mock Interview Drive", body: "Sign-up open for March 28–29 mock interviews.", tag: "" },
];

function TNPControlPanel() {
  const [activePanel, setActivePanel] = useState("college");

  // College Profile State
  const [college, setCollege] = useState({
    name: "SVKM Institute of Technology",
    location: "Mumbai, Maharashtra",
    naac: "A+",
    affiliation: "Mumbai University",
    established: "2001",
    tpOfficer: "Prof. Sharma",
    tpEmail: "tpo@svkm.edu.in",
    tpPhone: "+91 98200 12345",
  });

  // Companies State
  const [companies, setCompanies] = useState(INIT_COMPANIES);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: "", role: "", ctc: "", skills: "", branches: "", year: "2025", status: "confirmed" });

  // Placement Results State
  const [placement, setPlacement] = useState({
    totalStudents: "847",
    placed: "612",
    avgPackage: "6.2",
    highestPackage: "24",
    placementPct: "73",
    csPlaced: "98",
    itPlaced: "71",
    ecePlaced: "54",
    mechPlaced: "38",
  });

  // Announcements State
  const [announcements, setAnnouncements] = useState(INIT_ANNOUNCEMENTS);
  const [showAnnForm, setShowAnnForm] = useState(false);
  const [newAnn, setNewAnn] = useState({ title: "", body: "", tag: "" });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addCompany = () => {
    if (!newCompany.name) return;
    setCompanies(prev => [...prev, { ...newCompany, id: Date.now() }]);
    setNewCompany({ name: "", role: "", ctc: "", skills: "", branches: "", year: "2025", status: "confirmed" });
    setShowCompanyForm(false);
  };

  const removeCompany = (id) => setCompanies(prev => prev.filter(c => c.id !== id));

  const addAnnouncement = () => {
    if (!newAnn.title) return;
    setAnnouncements(prev => [...prev, { ...newAnn, id: Date.now() }]);
    setNewAnn({ title: "", body: "", tag: "" });
    setShowAnnForm(false);
  };

  const removeAnnouncement = (id) => setAnnouncements(prev => prev.filter(a => a.id !== id));

  const PANELS = [
    { id: "college", label: "College Profile", icon: GraduationCap },
    { id: "companies", label: "Company Drives", icon: Building2 },
    { id: "placement", label: "Placement Results", icon: TrendingUp },
    { id: "announcements", label: "Announcements", icon: Megaphone },
  ];

  const inputCls = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 placeholder-gray-300 transition-all";
  const labelCls = "block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide";

  return (
    <div className="mt-8 space-y-5">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">TNP Control Panel</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Fill your college placement data — students use this for AI matching
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all shadow-sm ${saved ? "bg-green-500 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
        >
          {saved ? (
            <><CheckCircle className="w-4 h-4" /> Saved!</>
          ) : (
            <><Save className="w-4 h-4" /> Save Changes</>
          )}
        </button>
      </div>

      {/* Panel Tabs */}
      <div className="flex gap-2 flex-wrap">
        {PANELS.map(p => {
          const Icon = p.icon;
          return (
            <button
              key={p.id}
              onClick={() => setActivePanel(p.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activePanel === p.id ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"}`}
            >
              <Icon className="w-4 h-4" />
              {p.label}
            </button>
          );
        })}
      </div>

      {/* ── Panel: College Profile ── */}
      {activePanel === "college" && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-gray-900">College Profile</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>College Name</label>
              <input className={inputCls} value={college.name} onChange={e => setCollege({ ...college, name: e.target.value })} placeholder="e.g. SVKM Institute of Technology" />
            </div>
            <div>
              <label className={labelCls}>Location</label>
              <input className={inputCls} value={college.location} onChange={e => setCollege({ ...college, location: e.target.value })} placeholder="City, State" />
            </div>
            <div>
              <label className={labelCls}>NAAC Grade</label>
              <select className={inputCls} value={college.naac} onChange={e => setCollege({ ...college, naac: e.target.value })}>
                {["A++", "A+", "A", "B++", "B+", "B", "C"].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>University Affiliation</label>
              <input className={inputCls} value={college.affiliation} onChange={e => setCollege({ ...college, affiliation: e.target.value })} placeholder="e.g. Mumbai University" />
            </div>
            <div>
              <label className={labelCls}>Established Year</label>
              <input className={inputCls} value={college.established} onChange={e => setCollege({ ...college, established: e.target.value })} placeholder="e.g. 2001" />
            </div>
            <div>
              <label className={labelCls}>TPO Name</label>
              <input className={inputCls} value={college.tpOfficer} onChange={e => setCollege({ ...college, tpOfficer: e.target.value })} placeholder="Training & Placement Officer" />
            </div>
            <div>
              <label className={labelCls}>TPO Email</label>
              <input className={inputCls} type="email" value={college.tpEmail} onChange={e => setCollege({ ...college, tpEmail: e.target.value })} placeholder="tpo@college.edu" />
            </div>
            <div>
              <label className={labelCls}>TPO Phone</label>
              <input className={inputCls} value={college.tpPhone} onChange={e => setCollege({ ...college, tpPhone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
            </div>
          </div>

          {/* Info note */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
            <Target className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 leading-relaxed">
              This data powers the AI matching system. Students from your college will be matched with companies based on this profile and the company drives you add below.
            </p>
          </div>
        </div>
      )}

      {/* ── Panel: Company Drives ── */}
      {activePanel === "companies" && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-gray-900">Company Drives</h3>
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold">{companies.length} companies</span>
            </div>
            <button
              onClick={() => setShowCompanyForm(!showCompanyForm)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Company
            </button>
          </div>

          {/* Add Company Form */}
          {showCompanyForm && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-3">
              <p className="text-sm font-semibold text-blue-800">New Company Drive</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Company Name</label>
                  <input className={inputCls} value={newCompany.name} onChange={e => setNewCompany({ ...newCompany, name: e.target.value })} placeholder="e.g. Google" />
                </div>
                <div>
                  <label className={labelCls}>Role</label>
                  <input className={inputCls} value={newCompany.role} onChange={e => setNewCompany({ ...newCompany, role: e.target.value })} placeholder="e.g. SDE-1" />
                </div>
                <div>
                  <label className={labelCls}>CTC (LPA)</label>
                  <input className={inputCls} type="number" value={newCompany.ctc} onChange={e => setNewCompany({ ...newCompany, ctc: e.target.value })} placeholder="e.g. 12" />
                </div>
                <div>
                  <label className={labelCls}>Year</label>
                  <select className={inputCls} value={newCompany.year} onChange={e => setNewCompany({ ...newCompany, year: e.target.value })}>
                    {["2025", "2026", "2024"].map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Required Skills</label>
                  <input className={inputCls} value={newCompany.skills} onChange={e => setNewCompany({ ...newCompany, skills: e.target.value })} placeholder="DSA, React, SQL (comma separated)" />
                </div>
                <div>
                  <label className={labelCls}>Eligible Branches</label>
                  <input className={inputCls} value={newCompany.branches} onChange={e => setNewCompany({ ...newCompany, branches: e.target.value })} placeholder="CS, IT, ECE or ALL" />
                </div>
                <div>
                  <label className={labelCls}>Status</label>
                  <select className={inputCls} value={newCompany.status} onChange={e => setNewCompany({ ...newCompany, status: e.target.value })}>
                    <option value="confirmed">Confirmed</option>
                    <option value="tentative">Tentative</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={addCompany} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors">
                  Add Company
                </button>
                <button onClick={() => setShowCompanyForm(false)} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 bg-white transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Company List */}
          <div className="space-y-3">
            {companies.map(c => (
              <div key={c.id} className="flex items-start gap-3 bg-gray-50 rounded-2xl px-4 py-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-700 shrink-0 shadow-sm">
                  {c.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">{c.name}</span>
                    <span className="text-xs text-gray-400">{c.role}</span>
                    <span className="text-xs font-bold text-green-600">{c.ctc} LPA</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.status === "confirmed" ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"}`}>
                      {c.status}
                    </span>
                  </div>
                  <div className="flex gap-3 text-xs text-gray-400">
                    <span>Skills: <span className="text-gray-600">{c.skills}</span></span>
                    <span>Branches: <span className="text-gray-600">{c.branches}</span></span>
                    <span>Year: <span className="text-gray-600">{c.year}</span></span>
                  </div>
                </div>
                <button onClick={() => removeCompany(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 flex items-start gap-2">
            <Cpu className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              Skills you add here are used by SkillBridge AI to match your students with the right companies and show them exactly what to learn.
            </p>
          </div>
        </div>
      )}

      {/* ── Panel: Placement Results ── */}
      {activePanel === "placement" && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-gray-900">Placement Results 2025</h3>
          </div>

          {/* Overall Stats */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Overall Batch</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total Students", key: "totalStudents", placeholder: "e.g. 847" },
                { label: "Students Placed", key: "placed", placeholder: "e.g. 612" },
                { label: "Average Package (LPA)", key: "avgPackage", placeholder: "e.g. 6.2" },
                { label: "Highest Package (LPA)", key: "highestPackage", placeholder: "e.g. 24" },
                { label: "Placement % (auto)", key: "placementPct", placeholder: "e.g. 73" },
              ].map(f => (
                <div key={f.key}>
                  <label className={labelCls}>{f.label}</label>
                  <input
                    className={inputCls}
                    value={placement[f.key]}
                    onChange={e => setPlacement({ ...placement, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    type={f.key === "placed" || f.key === "totalStudents" ? "number" : "text"}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Department-wise Placed Students</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Computer Science", key: "csPlaced" },
                { label: "Information Tech", key: "itPlaced" },
                { label: "Electronics (ECE)", key: "ecePlaced" },
                { label: "Mechanical", key: "mechPlaced" },
              ].map(f => (
                <div key={f.key}>
                  <label className={labelCls}>{f.label}</label>
                  <input
                    className={inputCls}
                    value={placement[f.key]}
                    onChange={e => setPlacement({ ...placement, [f.key]: e.target.value })}
                    placeholder="Number of students placed"
                    type="number"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Live Preview</p>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Total", val: placement.totalStudents, color: "text-gray-900" },
                { label: "Placed", val: placement.placed, color: "text-green-600" },
                { label: "Avg Package", val: `₹${placement.avgPackage}L`, color: "text-blue-600" },
                { label: "Highest", val: `₹${placement.highestPackage}L`, color: "text-purple-600" },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
                  <p className={`text-xl font-bold ${s.color}`}>{s.val}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Panel: Announcements ── */}
      {activePanel === "announcements" && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-gray-900">TNP Announcements</h3>
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold">{announcements.length} active</span>
            </div>
            <button
              onClick={() => setShowAnnForm(!showAnnForm)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> New
            </button>
          </div>

          {/* Add Form */}
          {showAnnForm && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-3">
              <p className="text-sm font-semibold text-blue-800">Create Announcement</p>
              <div>
                <label className={labelCls}>Title</label>
                <input className={inputCls} value={newAnn.title} onChange={e => setNewAnn({ ...newAnn, title: e.target.value })} placeholder="e.g. Google Drive Registration Open" />
              </div>
              <div>
                <label className={labelCls}>Body</label>
                <textarea className={`${inputCls} resize-none`} rows={2} value={newAnn.body} onChange={e => setNewAnn({ ...newAnn, body: e.target.value })} placeholder="Announcement details..." />
              </div>
              <div>
                <label className={labelCls}>Tag (optional)</label>
                <select className={inputCls} value={newAnn.tag} onChange={e => setNewAnn({ ...newAnn, tag: e.target.value })}>
                  <option value="">None</option>
                  <option value="NEW">NEW</option>
                  <option value="URGENT">URGENT</option>
                  <option value="REMINDER">REMINDER</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={addAnnouncement} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors">
                  Publish
                </button>
                <button onClick={() => setShowAnnForm(false)} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 bg-white transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Announcements List */}
          <div className="space-y-3">
            {announcements.map(a => (
              <div key={a.id} className="flex items-start gap-3 bg-gray-50 rounded-2xl px-4 py-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-gray-900">{a.title}</span>
                    {a.tag && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-semibold">{a.tag}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{a.body}</p>
                </div>
                <button onClick={() => removeAnnouncement(a.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5" />
            These announcements appear in the student dashboard under "TNP Announcements"
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Component ──────────────────────────────────────────────────────

const Admin = () => {
  return (
    <div className="flex flex-col pb-10">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Control</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            TNP Cell · Manage your college placement data
          </p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-xl">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-green-700">Placement Season Active</span>
        </div>
      </div>

      {/* Subscription Section */}
      <SubscriptionSection />

      {/* Divider */}
      <div className="flex items-center gap-4 my-8">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">TNP Control Panel</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* TNP Control Panel */}
      <TNPControlPanel />
    </div>
  );
};

export default Admin;