import React, { useState } from "react";
import { Menu, User } from "lucide-react";
import StudentProfile from "./Profile";

const Sidebar = () => {
  const [activeSection, setActiveSection] = useState("Profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sections = ["Profile"];

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden p-3 m-2 bg-[#1B3C53] text-white rounded-md z-50"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu />
      </button>

      {/* Sidebar */}
      <aside
        className={`bg-[#1B3C53] text-white w-64 p-5 space-y-6 fixed md:static top-0 z-40 h-full transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <User className="w-6 h-6" /> Hi, Us         er
        </h1>
        <nav className="space-y-2">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => {
                setActiveSection(section);
                setIsSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-2 rounded-md transition ${
                activeSection === section ? "bg-[#456882]" : "hover:bg-[#354b61]"
              }`}
            >
              {section}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 mt-16 md:mt-0 p-4 md:ml-64">
        <h2 className="text-2xl font-bold text-[#1B3C53] mb-6">
          {activeSection}
        </h2> 

        {activeSection === "Profile" && <StudentProfile />}
        {activeSection === "Profile" && <StudentProfile />}

      </main>
    </div>
  );
};

export default Sidebar;
