import React, { useState } from "react";
import { User, Building2, Bell, Lock, LogOut } from "lucide-react";

const InstituteSettings = () => {
  const [form, setForm] = useState({
    instituteName: "",
    email: "",
    contactNumber: "",
    notifyEmail: true,
    notifySMS: false,
    password: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Settings saved!");
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <h2 className="text-3xl font-bold flex items-center gap-3 mb-8 text-gray-800">
        <Building2 className="text-blue-500" size={28} />
        Institute Settings
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Section */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-700">
            <User size={22} className="text-green-600" />
            Profile
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="instituteName"
              value={form.instituteName}
              onChange={handleChange}
              placeholder="Institute Name"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="tel"
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
              placeholder="Contact Number"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-700">
            <Bell size={22} className="text-yellow-500" />
            Notifications
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                name="notifyEmail"
                checked={form.notifyEmail}
                onChange={handleChange}
                className="w-4 h-4"
              />
              Email Alerts
            </label>
            <label className="flex items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                name="notifySMS"
                checked={form.notifySMS}
                onChange={handleChange}
                className="w-4 h-4"
              />
              SMS Alerts
            </label>
          </div>
        </div>

        {/* Password Change Section */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-700">
            <Lock size={22} className="text-purple-600" />
            Change Password
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Current Password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="New Password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="password"
              name="confirmNewPassword"
              value={form.confirmNewPassword}
              onChange={handleChange}
              placeholder="Confirm New Password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 shadow"
          >
            Save Changes
          </button>
          <button
            type="button"
            className="flex items-center gap-2 text-red-500 hover:text-red-600 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </form>
    </div>
  );
};

export default InstituteSettings;
