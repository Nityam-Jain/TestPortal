import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function AdminStats() {
  const [stats, setStats] = useState({ users: 0, vendors: 0, total: 0 });
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);

  const token = sessionStorage.getItem("adminToken"); // assuming you store token here

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
      Swal.fire("Error", err.response?.data?.message || "Failed to load stats", "error");
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
      <h1 className="text-2xl font-bold mb-6">📊 Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">👤 Users</h2>
          <p className="text-2xl font-bold">{stats.users}</p>
        </div>
        <div className="bg-green-100 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">🏢 Vendors</h2>
          <p className="text-2xl font-bold">{stats.vendors}</p>
        </div>
        <div className="bg-purple-100 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">📊 Total Accounts</h2>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
      </div>

      {/* Users Table */}
      {/* <h2 className="text-xl font-bold mb-3">👤 Users</h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full border rounded-xl">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">sr.no</th>
              <th className="px-4 py-2 text-left">Username</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">School</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u._id} className=" ">
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">{u.username}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.phone}</td>
                <td className="px-4 py-2">{u.school}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}

      {/* Vendors Table */}
      {/* <h2 className="text-xl font-bold mb-3">🏢 Vendors</h2>
      <div className="overflow-x-auto">
        <table className="w-full border rounded-xl">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Username</th>
              <th className="px-4 py-2 text-left">Email</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v, i) => (
              <tr key={v._id} className="border-b">
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
