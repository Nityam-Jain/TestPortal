// components/ProfileVendor.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Briefcase,
  CreditCard,
  Edit2,
  Mail,
  MapPin,
  Save,
  Smartphone,
  User,
  XCircle,
} from "lucide-react";

const ProfileVendor = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobile: "",
    address: "",
    businessName: "",
    idProofName: "",
    idProofNumber: "",
  });

  useEffect(() => {
    const token = sessionStorage.getItem("venderToken");

    axios
      .get("/api/auth/vendorprofile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProfile(res.data);
        setFormData({
          username: res.data.username,
          email: res.data.email,
          mobile: res.data.mobile,
          address: res.data.address,
          businessName: res.data.businessName,
          idProofName: res.data.idProofName,
          idProofNumber: res.data.idProofNumber,
        });
      })
      .catch((err) => {
        Swal.fire("Error", "Failed to fetch vendor profile", "error");
        console.error(err);
      });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("venderToken");

    try {
      const res = await axios.put(
        "/api/auth/vendorprofile/updateUserProfile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfile(res.data.vendor || res.data);
      setEditMode(false);
      Swal.fire("Success", "Profile updated successfully", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to update profile", "error");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center py-10 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-5xl p-6 md:p-8 relative">
        <h2 className="text-3xl font-bold text-center text-[#1B3C53] mb-8">
          {profile ? `${profile.username}'s Profile` : "Vendor Profile"}
        </h2>

        {profile ? (
          editMode ? (
            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1B3C53]"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1B3C53]"
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1B3C53]"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                <textarea
                  name="address"
                  rows="2"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1B3C53]"
                />
              </div>

              {/* Business Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Business / Institute</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1B3C53]"
                />
              </div>

              {/* ID Proof Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  ID Proof Name
                </label>
                <select
                  name="idProofName"
                  value={formData.idProofName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1B3C53]"
                >
                  <option value="">Select Proof</option>
                  <option value="Aadhar Card">Aadhar Card</option>
                  <option value="PAN Card">PAN Card</option>
                  <option value="Passport">Passport</option>
                  <option value="Driving License">Driving License</option>
                </select>
              </div>

              {/* ID Proof Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {formData.idProofName
                    ? `${formData.idProofName} Number`
                    : "ID Proof Number"}
                </label>
                <input
                  type="text"
                  name="idProofNumber"
                  value={formData.idProofNumber}
                  onChange={handleChange}
                  placeholder={
                    formData.idProofName
                      ? `Enter ${formData.idProofName} Number`
                      : "Enter ID Proof Number"
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1B3C53]"
                />
              </div>


              {/* Buttons */}
              <div className="md:col-span-2 flex gap-4 justify-end mt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  <Save size={18} /> Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="flex items-center gap-2 bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  <XCircle size={18} /> Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="relative">
              {/* Edit Button */}
              <div className="absolute -top-10 right-0 md:-top-15">
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 bg-blue-500 text-white h-10 px-4 rounded-lg hover:bg-blue-600 transition"
                >
                  <Edit2 size={18} /> Edit
                </button>
              </div>

              <div className="space-y-6">
                {/* Group 1: Username, Email, Mobile */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 rounded-xl shadow-md bg-gradient-to-r from-blue-100 to-blue-200 hover:scale-105 transition">
                    <div className="flex items-center gap-4">
                      <User className="text-blue-600" size={28} />
                      <div>
                        <p className="text-gray-500 text-sm">Username</p>
                        <p className="text-gray-800 font-semibold">{profile.username}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl shadow-md bg-gradient-to-r from-purple-100 to-purple-200 hover:scale-105 transition">
                    <div className="flex items-center gap-4">
                      <Mail className="text-purple-600" size={28} />
                      <div>
                        <p className="text-gray-500 text-sm">Email</p>
                        <p className="text-gray-800 font-semibold">{profile.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl shadow-md bg-gradient-to-r from-green-100 to-green-200 hover:scale-105 transition">
                    <div className="flex items-center gap-4">
                      <Smartphone className="text-green-600" size={28} />
                      <div>
                        <p className="text-gray-500 text-sm">Mobile</p>
                        <p className="text-gray-800 font-semibold">{profile.mobile}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Group 2: Address, Business, ID Proof */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 rounded-xl shadow-md bg-gradient-to-r from-yellow-100 to-yellow-200 hover:scale-105 transition">
                    <div className="flex items-center gap-4">
                      <MapPin className="text-yellow-600" size={28} />
                      <div>
                        <p className="text-gray-500 text-sm">Address</p>
                        <p className="text-gray-800 font-semibold">{profile.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl shadow-md bg-gradient-to-r from-pink-100 to-pink-200 hover:scale-105 transition">
                    <div className="flex items-center gap-4">
                      <Briefcase className="text-pink-600" size={28} />
                      <div>
                        <p className="text-gray-500 text-sm">Business / Institute</p>
                        <p className="text-gray-800 font-semibold">{profile.businessName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl shadow-md bg-gradient-to-r from-indigo-100 to-indigo-200 hover:scale-105 transition">
                    <div className="flex items-center gap-4">
                      <CreditCard className="text-indigo-600" size={28} />
                      <div>
                        <p className="text-gray-500 text-sm">ID Proof</p>
                        <p className="text-gray-800 font-semibold">{profile.idProofName}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Group 3: ID Proof Number */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  <div className="p-4 rounded-xl shadow-md bg-gradient-to-r from-gray-100 to-gray-200 hover:scale-105 transition">
                    <div className="flex items-center gap-4">
                      <CreditCard className="text-gray-600" size={28} />
                      <div>
                        <p className="text-gray-500 text-sm">
                          {profile.idProofName
                            ? `${profile.idProofName} Number`
                            : "ID Number"}
                        </p>
                        <p className="text-gray-800 font-semibold">{profile.idProofNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div> 
            </div>
          )
        ) : (
          <p className="text-center text-gray-500">Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default ProfileVendor;
