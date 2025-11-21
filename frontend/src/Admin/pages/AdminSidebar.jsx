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
  const [isOpen, setIsOpen] = useState(false);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, view: "Dashboard" },
    { label: "All Institutes", icon: Landmark, view: "AdminVendors" },
    { label: "All Students", icon: UserSearch, view: "AdminUsers" },
    { label: "Banner Manager", icon: Image, view: "CustomBanner" },
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

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-white border-r border-gray-200 shadow-lg transition-all duration-300 
        ${collapsed ? "w-16" : "w-64"} 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0`}
      >
        <div className="h-full flex flex-col px-4 py-4 relative">

          {/* ==== HEADER (Logo + Hi Admin) ==== */}
          <div className="flex flex-col items-start gap-3 mb-6 px-1">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1B3C53] rounded-lg flex items-center justify-center shadow-md">
                <BookOpen className="w-6 h-6 text-white" />
              </div>

              {!collapsed && (
                <h1 className="text-2xl font-bold text-[#1B3C53] tracking-wide">
                  TestPortal
                </h1>
              )}
            </div>

            {/* Hi Admin text */}
            {!collapsed && (
              <p className="text-lg font-semibold text-black ml-1">
                Hi, <span className="text-[#1B3C53]">Admin</span>
              </p>
            )}
          </div>

          {/* Close button (Mobile) */}
          <button
            className="md:hidden absolute right-3 top-4 text-gray-600"
            onClick={() => setIsOpen(false)}
          >
            <X size={22} />
          </button>

          {/* ==== MENU SECTION ==== */}
          <nav className="flex flex-col gap-1">

            {navItems
              .filter(
                (item) =>
                  item.label !== "Transactions" &&
                  item.label !== "Services" &&
                  item.label !== "Blogs" &&
                  item.label !== "Query"
              )
              .map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveView(item.view);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                ${activeView === item.view
                      ? "bg-[#2E5A72] text-white"
                    : "hover:bg-gray-100 text-gray-700"
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  {!collapsed && <span className="text-sm">{item.label}</span>}
                </button>
              ))}

            {/* ==== SUBSCRIPTION DROPDOWN ==== */}
            <div>
              <button
                onClick={() => setSubscriptionOpen(!subscriptionOpen)}
                className={`flex items-center gap-2 px-3 py-1.5  rounded-lg transition-all
                 ${activeView.startsWith("Subscription")
                    ? "bg-[#2E5A72] text-white"
                    : "hover:bg-gray-100 text-gray-700"
                  }`}
              >
                <Podcast className="w-5 h-5" />
                {!collapsed && (
                  <span className="text-sm flex-1 leading-none">Subscription</span>
                )}
                {!collapsed && (
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${subscriptionOpen ? "rotate-90" : ""
                      }`}
                  />
                )}
              </button>

              {subscriptionOpen && !collapsed && (
                <div className="ml-7 mt-1 flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setActiveView("AddSubscriptionPlan");
                      setIsOpen(false);
                    }}
                    className={`px-3 py-1.5 rounded-md text-sm leading-none
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
                    className={`px-3 py-1.5 rounded-md text-sm leading-none
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


            {/* ==== REMAINING MENU ITEMS ==== */}
            {navItems
              .filter(
                (item) =>
                  item.label === "Transactions" ||
                  item.label === "Services" ||
                  item.label === "Blogs" ||
                  item.label === "Query"
              )
              .map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveView(item.view);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                ${activeView === item.view
                      ? "bg-[#2E5A72] text-white"
                      : "hover:bg-gray-100 text-gray-700"
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  {!collapsed && <span className="text-sm">{item.label}</span>}
                </button>
              ))}
          </nav>

          {/* Collapse Button (Desktop only) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-24 hidden md:flex h-6 w-6 rounded-full border bg-white shadow-sm items-center justify-center hover:bg-gray-50"
          >
            <ChevronRight
              className={`h-4 w-4 transition-transform ${collapsed ? "" : "rotate-180"
                }`}
            />
          </button>

          {/* ==== LOGOUT BTN ==== */}
          <div className="mt-auto px-2">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
            >
              <LogOut className="w-5 h-5" />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
