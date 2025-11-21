import {
  BarChart2,
  ChevronRight,
  FileText,
  HexagonIcon,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
  X,
  Users,
  UserCheck,
  BookOpen,
  NotebookText,
  NotepadTextDashed,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function VendorSidebar({ onLogout, setActiveView, activeView }) {
  const [isOpen, setIsOpen] = useState(false); // mobile toggle
  const [collapsed, setCollapsed] = useState(false); // desktop collapse

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, view: "Dashboard" },
    { label: "Profile", icon: User, view: "Profile" },
    { label: "Subscription Details", icon: UserCheck, view: "Subscription" },
    { label: "Subscription Plan", icon: UserCheck, view: "Subscriptionplan" },
    { label: "all Student", icon: Users, view: "VendorStudent" },
    { label: "Manage Questions", icon: FileText, view: "ManageQuestions" },
    { label: "Manage Test", icon: NotebookText, view: "ManageTest" },
    { label: "Manage courses", icon: NotepadTextDashed, view: "ManageCourses" },
    { label: "Results", icon: BarChart2, view: "Results" },
    { label: "Settings", icon: Settings, view: "Settings" },
  ];

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden fixed w-full flex justify-between items-center bg-[#1B3C53] text-white p-4">
        <div className="w-8 h-8 bg-gradient-to-r from-[#1B3C53] to-[#456882] rounded-lg flex items-center justify-center shadow-md">
          <BookOpen className="w-5 h-5 text-[#F9F3EF]" />
        </div>
        <h2 className="text-xl font-bold">Dashboard</h2>
        <button onClick={() => setIsOpen(true)}>
          <Menu size={28} />
        </button>
      </div>

      {/* Sidebar Overlay on Mobile */}
      <div
        className={`fixed inset-0 z-50 bg-black bg-opacity-40 md:hidden transition-opacity duration-300 ${isOpen ? "block" : "hidden"
          }`}
        onClick={() => setIsOpen(false)}
      />

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
          fixed top-0 left-0 z-50 md:z-40 bottom-0 bg-white border-r border-gray-200 shadow-lg transition-all duration-300 ease-in-out
          ${collapsed ? "w-16" : "w-64"}
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
        `}
        >
          <div className="h-full flex flex-col px-3 py-6 relative">
            {/* Logo/Header */}
            <div className="flex items-center justify-between mb-10 px-3">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate("/")}
              >
                {/* Logo icon */}
                <div className="w-8 h-8 bg-gradient-to-r from-[#1B3C53] to-[#456882] rounded-lg flex items-center justify-center shadow-md">
                  <BookOpen className="w-5 h-5 text-[#F9F3EF]" />
                </div>

                {/* Title + Admin Panel stacked */}
                {!collapsed && (
                  <div className="flex flex-col leading-tight">
                    <h2 className="text-2xl font-bold text-[#1B3C53]">TestPortal</h2>
                    <p className="text-xl font-semibold text-gray-600 ">Institute Panel</p>
                  </div>
                )}
              </div>


              {/* Close Button in Mobile */}
              <button
                className="md:hidden text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            {/* Nav Items */}
            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                className="flex items-center gap-3 hover:text-[#D2C1B6] transition px-2"
                onClick={() => setIsOpen(false)}
              >
                {/* <Home className="w-5 h-5" />
                {!collapsed && (
                  <span className="text-base font-semibold">Go to Home</span>
                )} */}
              </Link>

              {navItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveView(item.view);
                    setIsOpen(false); // close mobile menu
                  }}
                  className={`flex items-center gap-3 text-left px-2 py-2 rounded-lg transition-all
                ${activeView === item.view
                      ? "bg-[#2E5A72] text-white"
                      : "hover:bg-[#2E5A72] hover:text-white"
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  {!collapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </button>
              ))}
            </nav>

            {/* Collapse Button (desktop only) */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="absolute -right-3 top-24 hidden md:flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 shadow-sm transition"
            >
              <ChevronRight
                className={`h-4 w-4 transition-transform ${collapsed ? "" : "rotate-180"
                  }`}
              />
            </button>

            {/* Logout */}
            <div className="mt-auto px-2">
              <button
                onClick={onLogout}
                className="w-full flex items-center pl-5 justify-center md:justify-start gap-2 bg-transparent text-black-600 hover:bg-red-100 hover:text-red-700 py-2 rounded-lg font-semibold transition-colors"
              >
                <LogOut className="w-5 h-5" />
                {!collapsed && <span>Logout</span>}
              </button>
            </div>

          </div>
        </aside>
      </div>
    </>
  );
}

export default VendorSidebar;
