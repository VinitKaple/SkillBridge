import Stats from '../components/Stats';
import { useState, useEffect, useMemo } from 'react';
import { Send, X, UserPlus, Info } from 'lucide-react';


const TNPCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/tnpdata?page=${currentPage}&limit=${itemsPerPage}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setCompanies(data.companies);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, [currentPage]);

  const sortedCompanies = useMemo(() => {
    if (!sortConfig.key) return companies;
    return [...companies].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      if (sortConfig.key === 'toughnessPercentage' || sortConfig.key === 'averagePackage') {
        aVal = Number(aVal);
        bVal = Number(bVal);
      }
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [companies, sortConfig]);

  const openPopup = (company) => {
    setSelectedCompany(company);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedCompany(null);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value === 'none') {
      setSortConfig({ key: null, direction: 'asc' });
    } else {
      const [key, direction] = value.split('-');
      setSortConfig({ key, direction });
    }
  };

  if (loading) return <div className="text-center py-10">Loading companies...</div>;
  if (error) return <div className="text-center py-10 text-red-600">Error: {error}</div>;

  return (
    <div className="p-4 sm:p-6">
 <div className="p-1 mb-4">

      
      <Stats />
    </div>
      {/* Sorting Dropdown */}
      <div className="mb-4 flex justify-end">
        
        <select
          value={sortConfig.key ? `${sortConfig.key}-${sortConfig.direction}` : 'none'}
          onChange={handleSortChange}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="none">Sort By</option>
          <option value="toughnessPercentage-desc">Toughness (High to Low)</option>
          <option value="toughnessPercentage-asc">Toughness (Low to High)</option>
          <option value="averagePackage-desc">Avg Package (High to Low)</option>
          <option value="averagePackage-asc">Avg Package (Low to High)</option>
          <option value="type-asc">Type (A-Z)</option>
          <option value="type-desc">Type (Z-A)</option>
        </select>
      </div>

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
              {sortedCompanies.length > 0 ? (
                sortedCompanies.map((company) => (
                  <tr key={company._id} className="hover:bg-gray-50">
                    <td
                      className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 cursor-pointer hover:underline focus:outline-none"
                      onClick={() => openPopup(company)}
                      onKeyDown={(e) => e.key === 'Enter' && openPopup(company)}
                      tabIndex={0}
                      role="button"
                    >
                      {company.companyName}
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
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition"
                      >
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

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 gap-4">
          <div className="text-sm text-gray-700 order-2 sm:order-1">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, companies.length)} of {companies.length} results
          </div>
          <div className="flex items-center gap-2 order-1 sm:order-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-2 sm:px-3 py-1 border rounded-md text-sm ${
                    currentPage === page
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Company Details Popup */}
      {showPopup && selectedCompany && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md sm:max-w-lg relative pointer-events-auto">
            <div className="border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
                <UserPlus size={20} className="text-indigo-500" />
                Company Details
              </h3>
              <button
                className="text-gray-400 hover:text-gray-600 transition"
                onClick={closePopup}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
              <p className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                {selectedCompany.companyName}
              </p>
              <div className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium text-gray-600">Type:</div>
                  <div className="text-gray-800">{selectedCompany.type}</div>
                  <div className="font-medium text-gray-600">Avg Package:</div>
                  <div className="text-gray-800">{selectedCompany.averagePackage} LPA</div>
                  <div className="font-medium text-gray-600">Toughness:</div>
                  <div className="text-gray-800">{selectedCompany.toughnessPercentage}%</div>
                </div>

                {/* Departments Targeted */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Departments Targeted</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCompany.departmentsTargeted.map((dept, idx) => (
                      <span key={idx} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs">
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Roles Offered */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Roles Offered</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {selectedCompany.rolesOffered.map((role, idx) => (
                      <li key={idx}>{role}</li>
                    ))}
                  </ul>
                </div>

                {/* Hiring Process (as flowchart steps) */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Hiring Process</h4>
                  <div className="space-y-3">
                    {selectedCompany.hiringProcess
                      .sort((a, b) => a.order - b.order)
                      .map((round, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                            {round.order}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{round.roundName}</p>
                            {round.description && (
                              <p className="text-xs text-gray-500">{round.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Info size={12} />
                  Data provided by Training & Placement Cell
                </p>
              </div>
            </div>

            <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
                onClick={closePopup}
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

export default TNPCompanies;