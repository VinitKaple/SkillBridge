import { Search, Bell, Grid3X3, Menu, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Topbar = ({ onMenuClick }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white border-b px-4 md:px-6 py-4 flex items-center justify-between">

      {/* Left - Mobile Menu + Back Button */}
      <div className="flex items-center gap-4">

        {/* ✅ Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-600 hover:text-blue-600 transition"
        >
          <Menu size={22} />
        </button>

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 cursor-pointer text-gray-600 text-sm hover:text-blue-600 transition"
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Back</span>
        </button>

      </div>

      {/* Search */}
      <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-4 py-2 w-1/2 lg:w-1/3">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search for data, user, docs"
          className="bg-transparent outline-none ml-2 w-full text-sm"
        />
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-4 md:gap-6">
        <Bell
          size={20}
          className="text-gray-600 cursor-pointer hover:text-blue-600 transition"
        />
        <Grid3X3
          size={20}
          className="text-gray-600 cursor-pointer hover:text-blue-600 transition"
        />
      </div>

    </div>
  );
};

export default Topbar;
