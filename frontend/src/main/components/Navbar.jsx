import React, { useState, useEffect } from "react";
import { BookOpen, Menu, User, X } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Button } from "../Button";
import StartTestButton from "./StartTestButton";
import Signup from "./SignUp";

function Navbar() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
    const [open, setOpen] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    const role = sessionStorage.getItem("role");
    if (role === "user" || role === "vendor") {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  }, []);

  const handleLogout = () => {
    if (userRole === "user") {
      sessionStorage.removeItem("userToken");
    } else if (userRole === "vendor") {
      sessionStorage.removeItem("venderToken");
    }
    sessionStorage.removeItem("role");

    setIsLoggedIn(false);
    setUserRole("");
    Swal.fire("Logged out!", "", "success");
    navigate("/");
  };

  const navLinkClasses = ({ isActive }) =>
    `relative inline-block px-1 text-black duration-300
  after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[1.4px] after:bg-[#1B3C53]
  after:transform after:scale-x-0 after:origin-center after:transition-transform after:duration-500
  ${
    isActive
      ? "after:scale-x-100 text-[#1B3C53]"
      : "hover:after:scale-x-100 hover:text-[#1B3C53]"
  }`;

   const toggleDropdown = () => {
    setOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setOpen(false);
  };

  return (
    <>
      <header className="bg-[#F9F3EF] border-b border-[#D2C1B6] sticky top-0 z-50 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-15">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[#1B3C53] to-[#456882] rounded-lg flex items-center justify-center shadow-md">
                <BookOpen className="w-5 h-5 text-[#F9F3EF]" />
              </div>
              <span className="text-xl font-bold text-[#1B3C53]">
                TestPortal
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <NavLink to="/" className={navLinkClasses}>
                Home
              </NavLink>
              <NavLink to="/Pricing" className={navLinkClasses}>
                Pricing
              </NavLink>
               <NavLink to="/Blogs" className={navLinkClasses}>
                Blogs
              </NavLink>
               <NavLink to="/Services" className={navLinkClasses}>
                Services
              </NavLink>
              {/* <NavLink to="/result" className={navLinkClasses}>
                Result
              </NavLink> */}
              <NavLink to="/ContactPage" className={navLinkClasses}>
                Contact
              </NavLink>
              
              
            </nav>

            {/* Desktop Auth / Dashboard */}
            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                   <div className="relative">
      <button
        onClick={toggleDropdown}
        className="bg-[#1B3C53] text-white w-10 h-10 rounded-full shadow-md flex items-center justify-center"
      >
        <User className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 bg-white border border-[#D2C1B6] rounded-lg shadow-lg z-50 w-40">
          <button
            onClick={() => {
              navigate(userRole === "vendor" ? "/VendorDashboard" : "/dashboard");
              closeDropdown();
            }}
            className="px-4 py-2 text-left hover:bg-[#f1f1f1] text-[#1B3C53] w-full"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => {
              handleLogout();
              closeDropdown();
            }}
            className="px-4 py-2 text-left hover:bg-[#f1f1f1] text-[#d33] w-full"
          >
            Logout
          </button>
        </div>
      )}
    </div>
              ) : (
                <>
                  <NavLink to="/login">
                    <button className="bg-[#1B3C53] text-white px-6 py-2 rounded-full hover:bg-white hover:text-black shadow-md font-semibold">
                      Login
                    </button>
                  </NavLink>
                  <button
                    onClick={() => setIsSignupOpen(true)}
                    className="bg-[#1B3C53] text-white px-6 py-2 rounded-full hover:bg-white hover:text-black shadow-md font-semibold"
                  >
                    Signup
                  </button>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              className="md:hidden p-2 text-[#1B3C53]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 border-t border-[#D2C1B6] py-4 space-y-4">
              <NavLink
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="block hover:text-[#1B3C53]"
              >
                Home
              </NavLink>
              {/* <NavLink
                to="/result"
                onClick={() => setIsMenuOpen(false)}
                className="block hover:text-[#1B3C53]"
              >
                Result
              </NavLink> */}
              <NavLink
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="block hover:text-[#1B3C53]"
              >
                Contact
              </NavLink>
              <StartTestButton />
              {isLoggedIn ? (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      navigate(
                        userRole === "vendor"
                          ? "/VendorDashboard"
                          : "/dashboard"
                      );
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-[#1B3C53] text-white py-2 rounded-full"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-[#d33] text-white py-2 rounded-full"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <NavLink to="/login" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full bg-[#1B3C53] text-white py-2 rounded-full">
                      Login
                    </button>
                  </NavLink>
                  <button
                    onClick={() => {
                      setIsSignupOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-[#1B3C53] text-white py-2 rounded-full"
                  >
                    Signup
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Signup Modal */}
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
    </>
  );
}

export default Navbar;
