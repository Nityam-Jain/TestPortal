import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function VendorSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    mobile: "",
    address: "",
    businessName: "",
    idProofName: "",
    idProofNumber: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const {
      username,
      name,
      email,
      mobile,
      address,
      businessName,
      idProofName,
      idProofNumber,
      password,
      confirmPassword,
    } = formData;

    if (
      !username ||
      !name ||
      !email ||
      !mobile ||
      !address ||
      !businessName ||
      !idProofName ||
      !idProofNumber ||
      !password ||
      !confirmPassword
    ) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "All fields are required.",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Email",
        text: "Please enter a valid email address.",
      });
      return false;
    }

    const mobileRegex = /^[0-9]{10}$/; // simple 10-digit check
    if (!mobileRegex.test(mobile)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Mobile",
        text: "Please enter a valid 10-digit mobile number.",
      });
      return false;
    }

    if (password.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Weak Password",
        text: "Password must be at least 6 characters long.",
      });
      return false;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Password Mismatch",
        text: "Confirm password does not match.",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const {
        username,
        name,
        email,
        mobile,
        address,
        businessName,
        idProofName,
        idProofNumber,
        password,
      } = formData;

      const res = await axios.post("/api/auth/signupVendor", {
        username,
        name,
        email,
        mobile,
        address,
        businessName,
        idProofName,
        idProofNumber,
        password,
      });

      const role = res.data.role || "vendor";

      Swal.fire({
        icon: "success",
        title: "Vendor Registered Successfully",
        text: "Your account has been created successfully!",
        confirmButtonText: "Login",
      }).then((result) => {
        if (result.isConfirmed) {
          if (role === "vendor") {
            navigate("/login");
          } else {
            navigate("/signup"); // fallback
          }
        }
      });
    } catch (error) {
      console.error("Signup error:", error);
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2d4854] px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10"
      >
        <h2 className="text-3xl font-bold text-center text-[#1B3C53] mb-8">
          Vendor Signup
        </h2>

        {/* Grid layout for responsiveness */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-[#1B3C53] mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3C53]"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-[#1B3C53] mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3C53]"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#1B3C53] mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3C53]"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-medium text-[#1B3C53] mb-1">
              Mobile No.
            </label>
            <input
              type="text"
              name="mobile"
              placeholder="Enter mobile number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3C53]"
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>

          {/* Address */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-[#1B3C53] mb-1">
              Address
            </label>
            <textarea
              name="address"
              rows="2"
              placeholder="Enter your address"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3C53]"
              value={formData.address}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Business/Institute */}
          <div>
            <label className="block text-sm font-medium text-[#1B3C53] mb-1">
              Business/Institute
            </label>
            <input
              type="text"
              name="businessName"
              placeholder="Business or Institute name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3C53]"
              value={formData.businessName}
              onChange={handleChange}
            />
          </div>

          {/* ID Proof Name */}
          <div>
            <label className="block text-sm font-medium text-[#1B3C53] mb-1">
              ID Proof Name
            </label>
            <select
              name="idProofName"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3C53]"
              value={formData.idProofName}
              onChange={handleChange}
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
            <label className="block text-sm font-medium text-[#1B3C53] mb-1">
              ID Proof Number
            </label>
            <input
              type="text"
              name="idProofNumber"
              placeholder="Enter ID Proof number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3C53]"
              value={formData.idProofNumber}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-[#1B3C53] mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3C53]"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-[38px] right-3 text-gray-600 hover:text-black"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-[#1B3C53] mb-1">
              Confirm Password
            </label>
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Re-enter password"
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3C53]"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute top-[38px] right-3 text-gray-600 hover:text-black"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full mt-6 bg-[#1B3C53] text-white py-2 rounded-lg font-semibold hover:bg-[#163243] transition duration-200"
        >
          Sign Up
        </button>

        {/* Redirect */}
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}

export default VendorSignup;
