import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const UserSignup = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "",
    dob: "",
    grade: "",
    institutionType: "",
    institutionName: "",
    stream: "",
    profileImage: null,
    vendorId: "",
  });

  const [availableStreams, setAvailableStreams] = useState([]);

  useEffect(() => {
    if (formData.grade === "10th") {
      setAvailableStreams(["General"]);
      setFormData((prev) => ({ ...prev, stream: "General" }));
    } else if (formData.grade === "11th" || formData.grade === "12th") {
      setAvailableStreams(["PCM", "PCB", "Commerce", "Arts"]);
      setFormData((prev) => ({ ...prev, stream: "" }));
    } else if (formData.grade === "College") {
      setAvailableStreams(["B.Tech", "B.Sc", "B.Com", "BA"]);
      setFormData((prev) => ({ ...prev, stream: "" }));
    } else {
      setAvailableStreams([]);
      setFormData((prev) => ({ ...prev, stream: "" }));
    }
  }, [formData.grade]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const validateForm = () => {
    const {
      username,
      email,
      password,
      confirmPassword,
      phone,
      gender,
      dob,
      grade,
      institutionType,
      institutionName,
      stream,
    } = formData;

    if (
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      !phone ||
      !gender ||
      !dob ||
      !grade ||
      !institutionType ||
      !institutionName ||
      !stream
    ) {
      Swal.fire("Error", "All fields are required", "error");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire("Error", "Please enter a valid email", "error");
      return false;
    }

    if (password.length < 6) {
      Swal.fire("Error", "Password must be at least 6 characters", "error");
      return false;
    }

    if (password !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const form = new FormData();
      for (const key in formData) {
        form.append(key, formData[key]);
      }

      const res = await axios.post("/api/auth/UserSignup", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const role = res.data.role;

      Swal.fire({
        title: "Signup Successful",
        text: "You can now log in",
        icon: "success",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          if (role === "user") {
            navigate("/Login");
          }
        }
      });
    } catch (error) {
      Swal.fire(
        "Signup Failed",
        error.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2d4854] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-4xl border border-[#D2C1B6]"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-[#1B3C53]">
          User Signup
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Username */}
          <div>
            <label className="block mb-1 font-medium text-sm">Student Name</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter student name"
              className="w-full px-3 py-1.5 border rounded"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full px-3 py-1.5 border rounded"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 font-medium text-sm">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, ""); // allow only numbers
                if (value.length <= 10) {
                  handleChange({
                    target: { name: "phone", value },
                  });
                }
              }}
              placeholder="Enter phone"
              className="w-full px-3 py-1.5 border rounded"
              maxLength={10} // also restricts typing more than 10
            />
          </div>


          {/* Gender */}
          <div>
            <label className="block mb-1 font-medium text-sm">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border rounded"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* DOB */}
          <div>
            <label className="block mb-1 font-medium text-sm">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border rounded"
            />
          </div>

          {/* Grade */}
          <div>
            <label className="block mb-1 font-medium text-sm">Academic Stage</label>
            <select
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border rounded"
            >
              <option value="">Select Academic Stage</option>
              <option value="10th">10th</option>
              <option value="11th">11th</option>
              <option value="12th">12th</option>
              <option value="College">College</option>
            </select>
          </div>

          {/* Stream */}
          <div>
            <label className="block mb-1 font-medium text-sm">Stream</label>
            {availableStreams.length === 1 && availableStreams[0] === "General" ? (
              <input
                type="text"
                name="stream"
                value="General"
                readOnly
                className="w-full px-3 py-1.5 border rounded bg-gray-100 cursor-not-allowed"
              />
            ) : (
              <select
                name="stream"
                value={formData.stream}
                onChange={handleChange}
                className="w-full px-3 py-1.5 border rounded"
                required={availableStreams.length > 0}
              >
                <option value="">
                  {availableStreams.length > 0 ? "Select Stream" : "Select Grade First"}
                </option>
                {availableStreams.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Institution Type */}
          <div>
            <label className="block mb-1 font-medium text-sm">Institution Type</label>
            <select
              name="institutionType"
              value={formData.institutionType}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border rounded"
            >
              <option value="">Select</option>
              <option value="School">School</option>
              <option value="College">College</option>
            </select>
          </div>

          {/* Institution Name */}
          <div>
            <label className="block mb-1 font-medium text-sm">
              {formData.institutionType ? `${formData.institutionType} Name` : "Institution Name"}
            </label>
            <input
              type="text"
              name="institutionName"
              value={formData.institutionName}
              onChange={handleChange}
              placeholder={`Enter ${formData.institutionType || "Institution"} name`}
              className="w-full px-3 py-1.5 border rounded"
            />
          </div>

          {/* Profile Image */}
          <div>
            <label className="block mb-1 font-medium text-sm">Profile Image</label>
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-3 py-1.5 border rounded"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block mb-1 font-medium text-sm">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border rounded pr-10"
            />
            <span
              className="absolute right-3 top-[33px] cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block mb-1 font-medium text-sm">Confirm Password</label>
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border rounded pr-10"
            />
            <span
              className="absolute right-3 top-[33px] cursor-pointer text-gray-500"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff /> : <Eye />}
            </span>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="w-1/2 bg-[#1B3C53] text-white py-2 rounded hover:bg-[#163343] transition"
          >
            Sign Up
          </button>
        </div>


        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default UserSignup;
