import React from "react";
import { Link } from "react-router-dom"; // Use "next/link" if using Next.js

const Navbar = () => {
  return (
    <header className="fixed top-0 w-full bg-white shadow-md z-50">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/nav.png"
            alt="Logo"
            className="h-9 w-auto object-contain"
          />
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Updated to use 'Link' and 'to' */}
          <Link
            to="/subscription"
            className="text-gray-700 hover:text-blue-600"
          >
            Subscription Plans
          </Link>

          <a href="#features" className="text-gray-700 hover:text-blue-600">
            Features
          </a>
        </div>

        {/* Custom Admin User Button */}
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            title="Go to Admin Page"
          >
            T
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
