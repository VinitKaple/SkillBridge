import React, { useEffect, useState } from 'react';
import { Eye, X, Briefcase, Target, Percent, Users, ListChecks } from 'lucide-react';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch companies from API
 useEffect(() => {
  const fetchCompanies = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/companies`);
      const data = await res.json();
      setCompanies(data);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchCompanies();
}, []);

  // Pagination state (you can reuse the logic from your existing code)
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = companies.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(companies.length / rowsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const openPopup = (company) => {
    setSelectedCompany(company);
    setShowPopup(true);
  };

  if (loading) return <div className="p-4">Loading companies...</div>;

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6">Companies</h1>

      {/* Companies Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company Name
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Toughness %
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRows.length > 0 ? (
                currentRows.map((company) => (
                  <tr key={company._id} className="hover:bg-gray-50">
                    {/* Clickable company name */}
                    <td
                      className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 cursor-pointer hover:underline focus:outline-none"
                      onClick={() => openPopup(company)}
                      tabIndex={0}
                      role="button"
                    >
                      {company.name}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {company.type}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {company.toughnessPercentage}%
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => openPopup(company)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition"
                      >
                        <Eye size={14} />
                        View More
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 sm:px-6 py-4 text-center text-sm text-gray-500">
                    No companies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (reuse your existing pagination component) */}
        <div className="bg-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 gap-4">
          {/* ... your pagination code here ... */}
        </div>
      </div>

      {/* Company Details Popup */}
      {showPopup && selectedCompany && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl relative pointer-events-auto max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Briefcase size={20} className="text-indigo-500" />
                {selectedCompany.name}
              </h3>
              <button
                className="text-gray-400 hover:text-gray-600 transition"
                onClick={() => setShowPopup(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              {/* Key Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 uppercase">Type</div>
                  <div className="font-medium">{selectedCompany.type}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 uppercase">Average Package</div>
                  <div className="font-medium">₹{selectedCompany.averagePackage} LPA</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 uppercase">Toughness</div>
                  <div className="font-medium">{selectedCompany.toughnessPercentage}%</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 uppercase">Departments Targeted</div>
                  <div className="font-medium">
                    {selectedCompany.departmentsTargeted?.join(', ')}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg sm:col-span-2">
                  <div className="text-xs text-gray-500 uppercase">Roles Mostly Offered</div>
                  <div className="font-medium">
                    {selectedCompany.rolesMostlyOffered?.join(', ')}
                  </div>
                </div>
              </div>

              {/* Hiring Process as Flowchart */}
              <div>
                <h4 className="text-md font-semibold mb-2 flex items-center gap-2">
                  <ListChecks size={18} className="text-indigo-500" />
                  Hiring Process
                </h4>
                <div className="flex flex-wrap items-center justify-start gap-2">
                  {selectedCompany.hiringProcess?.map((round, idx) => (
                    <React.Fragment key={idx}>
                      <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2 text-sm font-medium text-indigo-700">
                        {round.name}
                        {round.description && (
                          <span className="block text-xs text-gray-600 font-normal">
                            {round.description}
                          </span>
                        )}
                      </div>
                      {idx < selectedCompany.hiringProcess.length - 1 && (
                        <div className="text-gray-400 text-xl">→</div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                {(!selectedCompany.hiringProcess || selectedCompany.hiringProcess.length === 0) && (
                  <p className="text-sm text-gray-500">No hiring process details available.</p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 px-4 sm:px-6 py-4 flex justify-end">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Companies;