import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VendorSidebar from './VendorSidebar';
import VendorQuestionManager from '../components/VendorQuestionManager';
import TestManager from '../components/TestManager';
import ProfileVendor from './Profilevendor';
import CourseHierarchyManager from '../components/CourseHierarchyManager';
import VendorStudent from '../components/VendorStudent';
import VendorSetting from "../components/vendorSettings";
import VendorResult from "../components/vendorResult";
function VendorDashboard() {

    const vendorId = "6888c8542eada7b5ee86a227"; // from auth normally

  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("Dashboard");
  const [collapsed, setCollapsed] = useState(false); // Lifted up

  useEffect(() => {
     const token = sessionStorage.getItem("venderToken");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleLogout = () => {
     sessionStorage.removeItem("venderToken");
         sessionStorage.removeItem("role");

    navigate("/Login");
  };

  return (
    <div className=" min-h-screen flex bg-[#F4F6F8]">
      {/* Sidebar */}
      <VendorSidebar
        onLogout={handleLogout}
        setActiveView={setActiveView}
        activeView={activeView}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main Content */}
      <main
        className={`transition-all duration-300 flex-1 p-4 pt-9 md:p-6
        ml-0 ${collapsed ? "md:ml-16" : "md:ml-64"}`}
      >
        {activeView === "Dashboard" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h1 className="text-2xl font-bold text-[#1B3C53] mb-4">Welcome to Institute Panel</h1>
            <p className="text-[#456882]">
              This is your Institute dashboard. From here you can manage your tests, view results, and control your settings.
            </p>
 
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <div className="bg-[#1B3C53] text-white p-6 rounded-xl shadow">
                <h3 className="text-lg font-bold mb-2">Total Tests</h3>
                <p className="text-2xl">12</p>
              </div>
              <div className="bg-[#456882] text-white p-6 rounded-xl shadow">
                <h3 className="text-lg font-bold mb-2">Pending Reviews</h3>
                <p className="text-2xl">4</p>
              </div>
              <div className="bg-[#1B3C53] text-white p-6 rounded-xl shadow">
                <h3 className="text-lg font-bold mb-2">Total Students</h3>
                <p className="text-2xl">87</p>
              </div>
            </div>
          </div>
        )}

        {activeView === "Profile" && <ProfileVendor />}
        {activeView === "ManageQuestions" && <VendorQuestionManager />}
        {activeView === "ManageTest" && <TestManager />}
        {activeView === "VendorStudent" && <VendorStudent/>}
        {activeView === "ManageCourses" &&  <CourseHierarchyManager vendorId={vendorId} />}
        {activeView === "Settings" && <VendorSetting/>}  
        {activeView === "Results" && <VendorResult/>}  
    </main>
    </div>
  );
}

export default VendorDashboard;
