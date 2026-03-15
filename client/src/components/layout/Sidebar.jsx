import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileSearch,
  FilePlus,
  Target,           // for Mock Preparation
  Mail,              // for Contact Us
  Shield,            // for Admin Control
  Power 
,            // optional logout
} from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Resume Analysis", icon: FileSearch, path: "/dashboard/resume-engine" },
    { name: "Resume Builder", icon: FilePlus, path: "/dashboard/build" },
    { name: "Mock Preparation", icon: Target, path: "/dashboard/prepare" },
    { name: "Admin Control", icon: Shield, path: "/dashboard/admin" },
    { name: "Contact Us", icon: Mail, path: "/dashboard/settings" },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col justify-between p-6">
      {/* Top Section */}
      <div>
        <div className="mb-8 flex items-center gap-2">
          <div className="flex items-center justify-center">
            <img
              src="/logo.png"
              alt="SkillBridge Logo"
              className="h-8 w-auto object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">SkillBridge</h1>
            <p className="text-xs text-blue-600 font-medium">
              Career Growth AI
            </p>
          </div>
        </div>

        {/* Menu */}
        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={index}
                to={item.path}
                end={item.path === "/dashboard"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-semibold shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="space-y-4">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-all"
        >
          <Power size={18} />
          <span>Log Out</span>
        </NavLink>
        <div className="border-t pt-4 text-xs text-gray-400 font-medium text-center">
          © 2026 SKILLBRIDGE AI
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
