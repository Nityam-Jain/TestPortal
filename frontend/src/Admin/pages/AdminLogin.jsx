import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Home, Eye, EyeOff } from "lucide-react";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/admin/login", { email, password });
      sessionStorage.setItem("adminToken", res.data.token);
      console.log(res.data);
      navigate("/AdminDashboard");
    } catch (error) {
      console.log(error);
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-400">
      <form
        onSubmit={handleLogin}
        className="bg-amber-50 p-8 rounded shadow-md w-96"
      >
        <Link
          to="/"
          className="flex items-center gap-2 text-[#1B3C53] hover:text-[#456882] transition"
        >
          <Home className="w-5 h-5" />
        </Link>
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>

        {/* Email Input */}
        <input
          type="email"
          placeholder="admin@example.com"
          className="w-full mb-4 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password Input with Eye Toggle */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-2 border rounded pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gray-400 text-black p-2 rounded hover:bg-[#1B3C53] hover:text-black"
        >
         Sign in to dashboard
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
