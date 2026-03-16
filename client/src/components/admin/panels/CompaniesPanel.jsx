import { useState } from "react";
import { Plus, Trash2, Edit, Check, X } from "lucide-react";
import { toast } from "sonner";

const INIT = [
  { id: 1, name: "Google", role: "SDE", ctc: "24" },
  { id: 2, name: "Microsoft", role: "SDE", ctc: "19" },
  { id: 3, name: "Amazon", role: "SDE-II", ctc: "32" }
];

const CompaniesPanel = () => {
  const [companies, setCompanies] = useState(INIT);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: "", role: "", ctc: "" });

  // Handle inline update
  const updateCompany = (id, field, value) => {
    setCompanies(prev =>
      prev.map(c => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  // Save inline edits (just exit edit mode)
  const saveEdit = (id) => {
    setEditingId(null);
    toast.success("Company updated");
  };

  // Cancel inline edits (revert changes? we could keep original, but for simplicity just exit)
  const cancelEdit = () => {
    setEditingId(null);
  };

  // Delete company
  const deleteCompany = (id) => {
    setCompanies(prev => prev.filter(c => c.id !== id));
    toast.success("Company removed");
  };

  // Add new company
  const addCompany = () => {
    if (!newCompany.name || !newCompany.role || !newCompany.ctc) {
      toast.error("All fields are required");
      return;
    }
    const newId = Date.now(); // simple unique id
    setCompanies(prev => [...prev, { id: newId, ...newCompany }]);
    setNewCompany({ name: "", role: "", ctc: "" });
    setShowAddForm(false);
    toast.success("Company added");
  };

  return (
    <div className="bg-white border rounded-2xl p-5 space-y-4">
      {/* Header with Add button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Companies</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" /> Add Company
        </button>
      </div>

      {/* Add Company Form */}
      {showAddForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
          <p className="text-sm font-semibold text-blue-800">New Company</p>
          <div className="grid grid-cols-3 gap-3">
            <input
              placeholder="Name"
              value={newCompany.name}
              onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
              className="px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              placeholder="Role"
              value={newCompany.role}
              onChange={(e) => setNewCompany({ ...newCompany, role: e.target.value })}
              className="px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              placeholder="CTC (LPA)"
              value={newCompany.ctc}
              onChange={(e) => setNewCompany({ ...newCompany, ctc: e.target.value })}
              className="px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={addCompany}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Companies List */}
      <div className="space-y-3">
        {companies.map((company) => {
          const isEditing = editingId === company.id;
          return (
            <div
              key={company.id}
              className={`flex items-center justify-between p-4 rounded-xl transition ${
                isEditing ? "bg-blue-50 border border-blue-200" : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              {isEditing ? (
                // Edit mode – inline inputs for all fields
                <div className="flex-1 grid grid-cols-3 gap-3">
                  <input
                    value={company.name}
                    onChange={(e) => updateCompany(company.id, "name", e.target.value)}
                    className="px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Name"
                  />
                  <input
                    value={company.role}
                    onChange={(e) => updateCompany(company.id, "role", e.target.value)}
                    className="px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Role"
                  />
                  <input
                    value={company.ctc}
                    onChange={(e) => updateCompany(company.id, "ctc", e.target.value)}
                    className="px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="CTC"
                  />
                </div>
              ) : (
                // View mode – display company info
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border font-bold text-gray-700">
                    {company.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{company.name}</p>
                    <p className="text-xs text-gray-500">
                      {company.role} · {company.ctc} LPA
                    </p>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-1">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => saveEdit(company.id)}
                      className="p-2 hover:bg-green-100 rounded-lg text-green-600"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-2 hover:bg-red-100 rounded-lg text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditingId(company.id)}
                      className="p-2 hover:bg-gray-200 rounded-lg"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => deleteCompany(company.id)}
                      className="p-2 hover:bg-red-100 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompaniesPanel;