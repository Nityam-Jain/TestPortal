import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Signup from "./SignUp";
import { Home } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/login", formData); // emailOrUsername & password
      const { user, token } = res.data;

      Swal.fire({
        icon: "success",
        title: `Welcome`,
        text: `You are logged in as ${user.role}`,

        showConfirmButton: true,
      });

      // Store token & role

      // Redirect based on role
      if (user.role === "vendor") {
        sessionStorage.setItem("role", user.role);
        sessionStorage.setItem("venderToken", token);
        navigate("/VendorDashboard");
      } else if (user.role === "user") {
        sessionStorage.setItem("role", user.role);
        sessionStorage.setItem("userToken", token);

         
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err.response?.data?.message || "Something went wrong!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2d4854]">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm"
      >
        <Link
          to="/"
          className="flex items-center gap-2 text-[#1B3C53] hover:text-[#456882] transition"
        >
          <Home className="w-5 h-5" />
        </Link>
        <h2 className="text-2xl font-bold text-center mb-6 text-[#1B3C53]">
          Login
        </h2>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Email or Username</label>
          <input
            type="text"
            name="emailOrUsername"
            value={formData.emailOrUsername}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#1B3C53]"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#1B3C53]"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1B3C53] text-white py-2 rounded hover:bg-[#163343] transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="mt-4 text-sm text-center text-[#1B3C53]">
          Don't have an account?{" "}
          <button
            onClick={() => setIsSignupOpen(true)}
            className="text-blue-600 hover:underline"
            type="button"
          >
            Sign up here
          </button>
        </p>
      </form>

      {isSignupOpen && (
        <div className="fixed inset-0 bg-[#a7c3ff70] backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#F9F3EF] p-8 rounded-2xl shadow-2xl w-full max-w-md relative border border-[#D2C1B6]">
            <button
              className="absolute top-4 right-4 text-[#1B3C53] text-2xl hover:text-[#456882] transition"
              onClick={() => setIsSignupOpen(false)}
            >
              &times;
            </button>
            <div className="bg-white p-4 rounded-lg shadow-md border border-[#D2C1B6]">
              <Signup onClose={() => setIsSignupOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
