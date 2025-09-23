import {
  LayoutDashboard,
  Users,
  House,
  LogOut,
  ChevronRight,
  HexagonIcon,
  Menu,
  X,
  Image,
  Landmark,
  Briefcase,
  BookMarked,
  MessageCircle,
  Podcast,
  BadgeIndianRupee,
  BookOpen,
  Star,
  UsersRound,
  Building,
  UserSearch,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminSidebar({ activeView, setActiveView, onLogout, collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // mobile toggle
  const [subscriptionOpen, setSubscriptionOpen] = useState(false); // dropdown toggle

  const navItems = [
    { label: "Dashboard", icon: House, view: "Dashboard" },
    { label: "All Institutes", icon: Landmark, view: "AdminVendors" },
    { label: "All Students", icon: UserSearch, view: "AdminUsers" },
    { label: "Custom Banner", icon: Image, view: "CustomBanner" },
    { label: "Transactions", icon: BadgeIndianRupee, view: "Transactions" },
    { label: "Services", icon: Briefcase, view: "Services" },
    { label: "Blogs", icon: BookMarked, view: "Blogs" },
    { label: "Query", icon: MessageCircle, view: "Query" },
  ];

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden fixed w-full flex justify-between items-center bg-[#1B3C53] text-white p-4 z-50">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <button onClick={() => setIsOpen(true)}>
          <Menu size={28} />
        </button>
      </div>

      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 bg-opacity-40 md:hidden transition-opacity duration-300 ${isOpen ? "block" : "hidden"
          }`}
        onClick={() => setIsOpen(false)}
      />

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-50 md:z-40 h-screen bg-white border-r border-gray-200 shadow-lg transition-all duration-300 ease-in-out
          ${collapsed ? "w-16" : "w-64"}
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
        `}
        >
          <div className="h-full flex flex-col px-3 py-6 relative">
            {/* Logo */}
            <div className="flex items-center justify-between mb-10 px-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-[#1B3C53] to-[#456882] rounded-lg flex items-center justify-center shadow-md">
                  <BookOpen className="w-5 h-5 text-[#F9F3EF]" />
                </div>                {!collapsed && (
                  <h2 className="text-2xl font-bold text-[#1B3C53]">Admin</h2>
                )}
              </div>
              {/* Close in mobile */}
              <button
                className="md:hidden text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            {/* Nav Items */}
            <nav className="flex flex-col gap-2">
              {navItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveView(item.view);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left
                    ${activeView === item.view
                      ? "bg-[#2E5A72] text-white"
                      : "hover:bg-gray-100 text-gray-700"
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  {!collapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </button>
              ))}

              {/* Subscription Dropdown */}
              <div>
                <button
                  onClick={() => setSubscriptionOpen(!subscriptionOpen)}
                  className={`flex items-center gap-3 px-3 py-2 w-full rounded-lg transition-all text-left
                    ${activeView.startsWith("Subscription")
                      ? "bg-[#2E5A72] text-white"
                      : "hover:bg-gray-100 text-gray-700"
                    }`}
                >
                  <Podcast className="w-5 h-5" />
                  {!collapsed && (
                    <span className="flex-1 text-sm font-medium">
                      Subscription
                    </span>
                  )}
                  {!collapsed && (
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${subscriptionOpen ? "rotate-90" : ""
                        }`}
                    />
                  )}
                </button>

                {subscriptionOpen && !collapsed && (
                  <div className="ml-8 mt-1 flex flex-col gap-1">
                    <button
                      onClick={() => {
                        setActiveView("AddSubscriptionPlan");
                        setIsOpen(false);
                      }}
                      className={`px-3 py-1.5 rounded-md text-sm text-left
                        ${activeView === "AddSubscriptionPlan"
                          ? "bg-[#2E5A72] text-white"
                          : "hover:bg-gray-100 text-gray-700"
                        }`}
                    >
                      Add Subscription Plan
                    </button>
                    <button
                      onClick={() => {
                        setActiveView("AllSubscriptionPlans");
                        setIsOpen(false);
                      }}
                      className={`px-3 py-1.5 rounded-md text-sm text-left
                        ${activeView === "AllSubscriptionPlans"
                          ? "bg-[#2E5A72] text-white"
                          : "hover:bg-gray-100 text-gray-700"
                        }`}
                    >
                      All Subscription Plans
                    </button>
                  </div>
                )}
              </div>
            </nav>

            {/* Collapse Btn (desktop only) */}
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

export default AdminSidebar;
