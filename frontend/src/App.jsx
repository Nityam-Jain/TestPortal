import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./main/pages/Homepage";
import React from "react";
import Dashboard from "./student/pages/Dashboard";
import AdminDashboard from "./Admin/pages/AdminDashboard";
import TestPage from "./main/pages/Testpage/TestPage";
import VendorDashboard from "./vender/pages/VendorDashboard";
import Tests from "./main/pages/Tests";
import AdminLogin from "./Admin/pages/AdminLogin";
import Login from "./main/components/Login";
import Signup from "./main/components/SignUp";
import VendorSignup from "./vender/pages/VendorSignup";
import UserSignup from "./student/pages/UserSignup";
import Pricing from "./main/pages/Pricing/Pricing";
import ContactPage from "./main/pages/ContactUs/ContactPage";
import PublicTests from "./main/pages/Testpage/Publictest";
import Spotlight from "./main/components/Spotligt";
import TakeTest from "./student/components/TakeTest";
 
function App() {
  return (
    <>
      <Routes>
        <Route path="/UserSignup" element={<UserSignup />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/AdminLogin" element={<AdminLogin />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Pricing" element={<Pricing />} />
        <Route path="/ContactPage" element={<ContactPage />} />
        <Route path="/TestPage" element={<TestPage />} />
        <Route path="/VendorDashboard" element={<VendorDashboard />} />
        <Route path="/VendorSignup" element={<VendorSignup />} />
        <Route path="/PublicTests" element={<PublicTests />} />
        <Route path="/Tests" element={<Tests />} />
        <Route path="/Spotlight" element={<Spotlight />} />
        <Route path="/take-test/:testId" element={<TakeTest />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;
