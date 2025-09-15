import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Phone,
  Mail,
  Calendar,
  School,
  UserRound,
  BadgeCheck,
  GraduationCap,
  Pencil,
} from "lucide-react";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    gender: "",
    dob: "",
    grade: "",
    school: "",
  });

  useEffect(() => {
    const token = sessionStorage.getItem("userToken");
    axios
      .get("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile(res.data);
        setFormData(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("userToken");
      const res = await axios.put(
        "/api/auth/profile/updateUserProfile",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Swal.fire("Updated!", res.data.message, "success");
      setShowEdit(false);
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white rounded-2xl shadow-lg p-6 w-full max-w-7xl mx-auto relative">
      {/* Edit Button */}
      <button
        onClick={() => setShowEdit(true)}
        className="absolute top-4 right-6 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      >
        <Pencil className="w-5 h-5" />
        Edit
      </button>


      {/* Layout */}
      <div className="grid md:grid-cols-3 gap-8 items-center">
        {/* Left: Profile Pic & Basic Info */}
        <div className="  rounded-xl shadow-md p-6 flex flex-col items-center text-center border border-blue-300">
          <img
            src={`/uploads/${profile.profileImage}`}
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover    shadow-lg"
          />
          <h2 className="mt-4 text-2xl font-bold text-blue-800 flex items-center gap-2">
            <UserRound className="w-6 h-6" />
            {profile.username || "Unnamed"}
          </h2>
          <p className="text-blue-500 flex items-center  gap-2 mt-1">
            <Mail className="w-4 h-4" />
            {profile.email || "N/A"}
          </p>
        </div>

        <div className="md:col-span-2 space-y-6">
          <h3 className="text-xl font-semibold text-blue-900 border-b pb-2">
            Personal Details
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                icon: <Phone className="w-5 h-5 text-blue-500 " />,
                label: "Phone",
                value: profile.phone || "N/A",
              },
              {
                icon: <BadgeCheck className="w-5 h-5 text-blue-500" />,
                label: "Gender",
                value: profile.gender || "N/A",
              },
              {
                icon: <Calendar className="w-5 h-5 text-blue-500" />,
                label: "Date of Birth",
                value: profile.dob?.slice(0, 10) || "N/A",
              },
              {
                icon: <GraduationCap className="w-5 h-5 text-blue-500" />,
                label: "Grade",
                value: profile.grade || "N/A",
              },
              {
                icon: <School className="w-5 h-5 text-blue-500" />,
                label: "School",
                value: profile.school || "N/A",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg border  border-blue-300 p-4 flex items-center gap-3 shadow-bd hover:shadow-lg transition"
              >
                {item.icon}
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    {item.label}
                  </p>
                  <p className="text-gray-600 capitalize">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 flex justify-center items-center px-4">
          <form
            onSubmit={handleUpdate}
            className="bg-white rounded-2xl p-6 sm:p-8 max-w-xl w-full shadow-lg space-y-4 overflow-y-auto max-h-[90vh]"
          >
            <h2 className="text-2xl font-semibold text-blue-800 mb-2">
              Edit Profile
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-md font-semibold text-gray-700 mb-1">
                  UserName
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1B3C53]"
                  required
                />
              </div>
              <div>
                <label className="block text-md font-semibold text-gray-700 mb-1">
                  Mobile
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1B3C53]"
                  required
                />
              </div>
              <div>
                <label className="block text-md font-semibold text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="border w-full p-2 rounded-md focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-md font-semibold text-gray-700 mb-1">
                  DOB
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="border p-2 w-full rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-md font-semibold text-gray-700 mb-1">
                  Class
                </label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="border w-full p-2 rounded-md focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="Other">Selecct Class</option>
                  <option value="Other">10th</option>
                  <option value="Other">12th</option>
                  <option value="Other">Collage</option>
                </select>
              </div>
              <div>
                <label className="block text-md font-semibold text-gray-700 mb-1">
                  School Name
                </label>
                <input
                  type="text"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  placeholder="School"
                  className="border p-2 w-full rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setShowEdit(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;
