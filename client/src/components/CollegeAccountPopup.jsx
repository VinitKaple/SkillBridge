import React, { useEffect, useRef } from "react";

const CollegeAccountPopup = ({ isOpen, onClose, triggerRef, onMouseEnter, onMouseLeave }) => {
  const popupRef = useRef(null);

  // Optional: close on escape key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popupRef}
      className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
      style={{ top: triggerRef.current?.offsetHeight + 8 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="px-3 py-3 border-b border-gray-100">
        <p className="font-semibold text-gray-800">Global Institute of Technology</p>
        <p className="text-sm text-gray-600 ">tnp@git.edu</p>
      </div>

      <div className="px-2 py-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Premium Organization
        </span>
      </div>
    </div>
  );
};

export default CollegeAccountPopup;