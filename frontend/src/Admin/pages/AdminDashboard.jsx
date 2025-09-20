import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
 import AdminStats from "../components/AdminStats";
import CourseHierarchyManager from "../../vender/components/CourseHierarchyManager";
import AdminVendors from "../components/AdminVendors";
import ReelsManager from "../components/ReelsManager";
import AdminUsers from "../components/AdminUsers";
function AdminDashboard() {

 
  const navigate = useNavigate();
const [activeView, setActiveView] = useState("AdminStats");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (!token) navigate("/AdminLogin");
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("role");
    navigate("/AdminLogin");
  };

  return (
    <div className="min-h-screen flex bg-[#F4F6F8]">
      {/* Sidebar */}
      <AdminSidebar
        onLogout={handleLogout}
        activeView={activeView}
        setActiveView={setActiveView}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main Content */}
      <main
        className={`transition-all duration-300 flex-1 p-4 pt-9 md:p-6
        ml-0 ${collapsed ? "md:ml-16" : "md:ml-64"}`}
      >
        {activeView === "AdminStats" && <AdminStats/>}
        {/* {activeView === "ManageCourses" && <CourseHierarchyManager/>} */}
        {activeView === "AdminUsers" && < AdminUsers/>}
        {activeView === "AdminVendors" && <AdminVendors/>}
        {/* {activeView === "ReelsManager" && <ReelsManager/>} */}
     
      </main>
    </div>
  );
}

export default AdminDashboard;
