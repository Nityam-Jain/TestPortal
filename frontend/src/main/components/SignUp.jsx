// src/components/Signup.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { User, Briefcase, X } from "lucide-react";

const Signup = ({ onClose }) => {
  const navigate = useNavigate();

  const handleCandidateClick = () => {
     navigate("/UserSignup");
    
    onClose();
  };
  
  const handleEmployeeClick = () => {
     navigate("/VendorSignup");

    onClose(); // close the modal after navigation
  };

  return (
    <div className="fixed px-4 inset-0 z-50 bg-[#0000005b] bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl p-6 rounded-xl shadow-lg relative flex flex-col md:flex-row">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">
          <X size={24} />
        </button>

        {/* Candidate Section */}
        <div
          onClick={handleCandidateClick}
          className="cursor-pointer flex-1 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-300 p-6 hover:bg-gray-50 transition-all"
        >
          <User size={48} className="text-blue-600 mb-2" />
          <h2 className="text-xl font-semibold mb-1">User</h2>
        <p className="text-gray-600 text-sm text-center">
  Take tests, track your progress, and boost your learning journey with TestPortal.
</p>
        </div>

        {/* Employee Section */}
        <div
          onClick={handleEmployeeClick}
          className="cursor-pointer flex-1 flex flex-col items-center justify-center p-6 hover:bg-gray-50 transition-all"
        >
          <Briefcase size={48} className="text-[#1B3C53] mb-2" />
          <h2 className="text-xl font-semibold mb-1">Vendor</h2>
         <p className="text-gray-600 text-sm text-center">
  Post tests, manage candidates, and find top talent through TestPortal.
</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;