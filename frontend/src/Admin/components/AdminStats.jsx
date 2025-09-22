import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Users, Building2, UserCheck } from "lucide-react"; // icons

export default function AdminStats() {
  const [stats, setStats] = useState({ users: 0, vendors: 0, total: 0 });
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);

  const token = sessionStorage.getItem("adminToken");

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchVendors();
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

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchVendors = async () => {
    try {
      const res = await axios.get("/api/admin/vendors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVendors(res.data);
    } catch (err) {
      console.error(err);
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-r from-blue-200 to-blue-400 text-gray-800 p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Students</h2>
            <p className="text-3xl font-bold">{stats.users}</p>
          </div>
          <Users size={40} className="text-blue-700" />
        </div>

        <div className="bg-gradient-to-r from-green-200 to-green-400 text-gray-800 p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Institutes</h2>
            <p className="text-3xl font-bold">{stats.vendors}</p>
          </div>
          <Building2 size={40} className="text-green-700" />
        </div>

        <div className="bg-gradient-to-r from-purple-200 to-purple-400 text-gray-800 p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Total Accounts</h2>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>
          <UserCheck size={40} className="text-purple-700" />
        </div>
      </div>


      {/* Users Table */}
      {/* <h2 className="text-2xl font-bold mb-4">👤 Users</h2>
      <div className="overflow-x-auto mb-12">
        <table className="w-full border rounded-xl shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Username</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Institution</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr
                key={u._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">{u.username}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.phone}</td>
                <td className="px-4 py-2">{u.institutionName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}

      {/* Vendors Table */}
      {/* <h2 className="text-2xl font-bold mb-4">🏫 Vendors</h2>
      <div className="overflow-x-auto">
        <table className="w-full border rounded-xl shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Username</th>
              <th className="px-4 py-3 text-left">Email</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v, i) => (
              <tr
                key={v._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">{v.username}</td>
                <td className="px-4 py-2">{v.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>
  );
}
