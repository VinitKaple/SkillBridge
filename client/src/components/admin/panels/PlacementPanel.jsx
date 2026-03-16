import { useState, useEffect } from "react";
import { TrendingUp, Users, Award, BarChart3 } from "lucide-react";
import { toast } from "sonner";

const PlacementPanel = () => {
  const [data, setData] = useState({
    total: "847",
    placed: "612",
    avg: "6.2",
    highest: "24",
    // department-wise
    csPlaced: "98",
    itPlaced: "71",
    ecePlaced: "54",
    mechPlaced: "38",
  });

  // Derived percentage
  const [placementPct, setPlacementPct] = useState("72.3");

  useEffect(() => {
    const total = parseInt(data.total) || 0;
    const placed = parseInt(data.placed) || 0;
    if (total > 0) {
      const pct = ((placed / total) * 100).toFixed(1);
      setPlacementPct(pct);
    } else {
      setPlacementPct("0.0");
    }
  }, [data.total, data.placed]);

  const inputClass =
    "w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none";

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const savePlacement = () => {
    // Basic validation
    if (!data.total || !data.placed || !data.avg || !data.highest) {
      toast.error("Please fill all main fields");
      return;
    }
    toast.success("Placement data updated");
  };

  return (
    <div className="bg-white border rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-lg">Placement Results 2025</h3>
        </div>
        <button
          onClick={savePlacement}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition"
        >
          Save Changes
        </button>
      </div>

      {/* Main stats */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Total Students</label>
          <input
            className={inputClass}
            type="number"
            value={data.total}
            onChange={(e) => handleChange("total", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Students Placed</label>
          <input
            className={inputClass}
            type="number"
            value={data.placed}
            onChange={(e) => handleChange("placed", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Average Package (LPA)</label>
          <input
            className={inputClass}
            type="number"
            step="0.1"
            value={data.avg}
            onChange={(e) => handleChange("avg", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Highest Package (LPA)</label>
          <input
            className={inputClass}
            type="number"
            step="0.1"
            value={data.highest}
            onChange={(e) => handleChange("highest", e.target.value)}
          />
        </div>
      </div>

      {/* Department-wise */}
      <div className="pt-2">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-gray-500" />
          <h4 className="font-medium text-sm">Department-wise Placed Students</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Computer Science", key: "csPlaced" },
            { label: "Information Technology", key: "itPlaced" },
            { label: "Electronics (ECE)", key: "ecePlaced" },
            { label: "Mechanical", key: "mechPlaced" },
          ].map((dept) => (
            <div key={dept.key}>
              <label className="block text-xs text-gray-500 mb-1">{dept.label}</label>
              <input
                className={inputClass}
                type="number"
                value={data[dept.key]}
                onChange={(e) => handleChange(dept.key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Preview Cards */}
      <div className="bg-gray-50 p-4 rounded-xl border">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">Live Preview</span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <StatCard label="Total" value={data.total} />
          <StatCard label="Placed" value={data.placed} />
          <StatCard label="Placement %" value={`${placementPct}%`} />
          <StatCard label="Avg Package" value={`₹${data.avg}L`} />
          <StatCard label="Highest" value={`₹${data.highest}L`} />
          <StatCard label="CS Placed" value={data.csPlaced} />
          <StatCard label="IT Placed" value={data.itPlaced} />
          <StatCard label="ECE Placed" value={data.ecePlaced} />
        </div>
      </div>

      <p className="text-xs text-gray-400 flex items-center gap-1">
        <Award className="w-3.5 h-3.5" /> Department numbers are shown to students for branch-specific insights.
      </p>
    </div>
  );
};

// Stat card component
const StatCard = ({ label, value }) => (
  <div className="bg-white p-3 rounded-lg border text-center">
    <p className="font-bold text-base">{value}</p>
    <p className="text-[10px] text-gray-500 truncate">{label}</p>
  </div>
);

export default PlacementPanel;