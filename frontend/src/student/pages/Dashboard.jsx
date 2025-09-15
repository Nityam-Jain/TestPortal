import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, User, LogOut, Home, LayoutDashboard, FileText } from "lucide-react";
import StudentProfile from "./Profile";
// import Test from "../components/Test";
import TestSows from "../components/TestSows";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("userToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem("role");
    navigate("/login");
  };

  // Sections except "Home"
  const sections = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Profile", icon: User },
    { name: "My Test", icon: FileText },
  ];

  return (
    <div className="flex flex-col md:flex-row bg-[#F9F3EF] min-h-screen relative">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex justify-between items-center px-4 py-3 bg-[#1B3C53] text-white shadow-md">
        <button onClick={() => setIsSidebarOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">Hi, User</h1>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 w-64 h-screen bg-[#1B3C53] text-white p-5 flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Close Button (Mobile only) */}
        <button
          className="md:hidden absolute top-4 right-4 z-50 p-1 rounded-full hover:bg-[#2c516b]"
          onClick={() => setIsSidebarOpen(false)}
        >
          ✕
        </button>

        {/* Sidebar Content */}
        <div className="mt-10 md:mt-0">
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Hi, User
          </h1>

          <nav className="space-y-2">
            {/* Home button at the top */}
            <button
              onClick={() => {
                navigate("/");
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-md hover:bg-[#354b61]`}
            >
              <Home className="w-5 h-5" />
              Home
            </button>

            {/* Other sections */}
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.name}
                  onClick={() => {
                    setActiveSection(section.name);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-md transition ${
                    activeSection === section.name
                      ? "bg-[#456882]"
                      : "hover:bg-[#354b61]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {section.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="mt-10 md:mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center pl-5 justify-center md:justify-start gap-2 bg-transparent text-white-600 hover:hover:bg-[#354b61]  py-2 rounded-lg font-semibold transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile menu */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black opacity-40 z-40 md:hidden"
        />
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 ml-0 bg-gradient-to-b from-blue-50 to-white p-4 mt-4 md:mt-0">
        <h2 className="text-2xl font-bold text-[#1B3C53] mb-6">
          {activeSection}
        </h2>

        {activeSection === "Dashboard" && (
          <div className="max-w-7xl">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[{ title: "Total Tests", value: 24 }, { title: "Completed", value: 16 }, { title: "Pending", value: 8 }].map(
                ({ title, value }) => (
                  <div
                    key={title}
                    className="bg-white rounded-xl border border-blue-300 p-6 shadow-sm hover:shadow-lg transition duration-300"
                  >
                    <h3 className="text-lg font-semibold text-[#456882] mb-2">
                      {title}
                    </h3>
                    <p className="text-3xl font-bold text-[#1B3C53]">{value}</p>
                  </div>
                )
              )}
            </div>

            {/* Recent Activity */}
            <div className="mt-10">
              <h3 className="text-xl font-semibold text-[#1B3C53] mb-4">
                Recent Activity
              </h3>
              <div className="bg-white rounded-xl border border-blue-300 p-4 text-[#456882]">
                <p>No recent activity yet.</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === "Profile" && <StudentProfile />}
        {activeSection === "My Test" && <TestSows />}
        {/* {activeSection === "Tests" && <Test />} */}
      </main>
    </div>
  );
};

export default Dashboard;
