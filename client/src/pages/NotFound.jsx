import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="text-center">
        {/* Large Professional Number */}
        <h1 className="text-9xl font-extrabold text-gray-200 tracking-widest">
          404
        </h1>
        
        {/* Status Line */}
        <div className="bg-blue-600 text-white px-2 text-sm rounded rotate-12 absolute transform -translate-y-12 translate-x-24 hidden md:block">
          Page Not Found
        </div>

        <div className="mt-8">
          <h2 className="text-3xl font-bold text-gray-800 md:text-4xl">
            Something's missing.
          </h2>
          <p className="mt-4 text-gray-500 max-w-lg mx-auto text-lg leading-relaxed">
            Sorry, the page you are looking for doesn't exist or has been moved. 
            Check the URL or return to the dashboard to find your way.
          </p>
        </div>

        {/* Professional Button Group */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95"
          >
            Return Home
          </Link>
          
        </div>
      </div>

      {/* Footer Support Line */}
      <div className="mt-16 text-gray-400 text-sm">
        Need help? <a href="mailto:support@yourdomain.com" className="text-blue-600 hover:underline">Contact Support</a>
      </div>
    </div>
  );
};

export default NotFound;