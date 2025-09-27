import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Users,
  Building2,
  UserCheck,
  CreditCard, 
  BookOpen,
  ClipboardCheck,
  IndianRupee,
  HelpCircle
} from "lucide-react"; // added icons

export default function AdminStats() {
  const [stats, setStats] = useState({
    users: 0,
    vendors: 0,
    total: 0,
    subscribers: 0,
    tests: 0,
    pendingResults: 0,
    revenue: 0,
  });

  const token = sessionStorage.getItem("adminToken");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to load stats",
        "error"
      );
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-2 text-gray-800">
        Welcome to Dashboard
      </h1>
      <p className="text-gray-600 mb-8">
        Overview of your activities and stats
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {/* Students */}
        <div className="bg-gradient-to-r from-blue-200 to-blue-400 text-gray-800 p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Students</h2>
            <p className="text-3xl font-bold">{stats.users}</p>
          </div>
          <Users size={40} className="text-blue-700" />
        </div>

        {/* Institutes */}
        <div className="bg-gradient-to-r from-green-200 to-green-400 text-gray-800 p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Institutes</h2>
            <p className="text-3xl font-bold">{stats.vendors}</p>
          </div>
          <Building2 size={40} className="text-green-700" />
        </div>

        {/* Total Accounts */}
        <div className="bg-gradient-to-r from-purple-200 to-purple-400 text-gray-800 p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Total Accounts</h2>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>
          <UserCheck size={40} className="text-purple-700" />
        </div>

        {/* Subscribers */}
        <div className="bg-gradient-to-r from-yellow-200 to-yellow-400 text-gray-800 p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Subscribers</h2>
            <p className="text-3xl font-bold">{stats.subscribers}</p>
          </div>
          <CreditCard size={40} className="text-yellow-700" />
        </div>

        {/* Active Tests */}
        <div className="bg-gradient-to-r from-pink-200 to-pink-400 text-gray-800 p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Active Tests</h2>
            <p className="text-3xl font-bold">{stats.tests}</p>
          </div>
          <BookOpen size={40} className="text-pink-700" />
        </div>

        {/* Pending Results */}
        <div className="bg-gradient-to-r from-indigo-200 to-indigo-400 text-gray-800 p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Pending Results</h2>
            <p className="text-3xl font-bold">{stats.pendingResults}</p>
          </div>
          <ClipboardCheck size={40} className="text-indigo-700" />
        </div>

        {/* Revenue */}
        <div className="bg-gradient-to-r from-teal-200 to-teal-400 text-gray-800 p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Revenue</h2>
            <p className="text-3xl font-bold">₹{stats.revenue}</p>
          </div>
          <IndianRupee size={40} className="text-teal-700" />
        </div>

         {/* 🔹 Total Queries */}
        <div className="bg-gradient-to-r from-red-200 to-red-400 text-gray-800 p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Total Queries</h2>
            <p className="text-3xl font-bold">{stats.queries}</p>
          </div>
          <HelpCircle size={40} className="text-red-700" />
        </div>
      </div>
    </div>
  );
}
