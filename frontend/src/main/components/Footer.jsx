import React from "react";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#1B3C53] text-[#F9F3EF] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-[#456882] to-[#1B3C53] rounded-lg flex items-center justify-center shadow-md">
                <BookOpen className="w-5 h-5 text-[#F9F3EF]" />
              </div>
              <span className="text-2xl font-bold">TestPortal</span>
            </div>
            <p className="text-[#D2C1B6] max-w-md mb-4">
              The most comprehensive online testing platform for educators, trainers, and organizations worldwide.
            </p>
            <p className="text-sm text-[#456882]">© 2025 BinaryLogix. All rights reserved.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Product</h3>
            <ul className="space-y-2 text-[#D2C1B6]">
              <li>
                <Link to="/features" className="hover:text-[#F9F3EF] transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/security" className="hover:text-[#F9F3EF] transition-colors">
                  Statistics
                </Link>
              </li>
              <li>
                <Link to="/Pricing" className="hover:text-[#F9F3EF] transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/ContactUs" className="hover:text-[#F9F3EF] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/AdminLogin" className="hover:text-[#F9F3EF] transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-[#D2C1B6]">
              <li>
                <Link to="/help" className="hover:text-[#F9F3EF] transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/docs" className="hover:text-[#F9F3EF] transition-colors">
                  Documentation
                </Link>
              </li>
              
              <li>
                <Link to="/status" className="hover:text-[#F9F3EF] transition-colors">
                  System Status
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
