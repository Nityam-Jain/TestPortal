import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import
export default function LoginPopup() {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const navigate = useNavigate();

  const handleRedirect = (path) => {
    setPopupOpen(false);
    navigate(path);
  };

  return (
    <div className="flex flex-col items-center justify-center   bg-gray-100 px-4">
      {/* 🔘 Open Popup Button */}
      <button
        onClick={() => setPopupOpen(true)}
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold shadow-md"
      >
        Open Login Popup
      </button>

      {/* 🪟 Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm text-center relative">
            {/* ❌ Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-500 text-lg"
              onClick={() => setPopupOpen(false)}
            >
              ×
            </button>

            <h2 className="text-xl font-semibold mb-6">Login / Signup</h2>

            <div className="flex flex-col items-center gap-6">
              {/* 🧑 User Image Button */}
              <div className="cursor-pointer" onClick={() => handleRedirect("/user-login")}>
                <img
                  src="/user.png"
                  alt="User"
                  className="w-28 h-28 rounded-full object-cover shadow-md hover:scale-105 transition"
                />
                <p className="mt-2 text-sm font-medium text-gray-700">User Login / Signup</p>
              </div>

              {/* 🧑‍💼 Vendor Image Button */}
              <div className="cursor-pointer" onClick={() => handleRedirect("/vendor-login")}>
                <img
                  src="/vendor.png"
                  alt="Vendor"
                  className="w-28 h-28 rounded-full object-cover shadow-md hover:scale-105 transition"
                />
                <p className="mt-2 text-sm font-medium text-gray-700">Vendor Login / Signup</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
