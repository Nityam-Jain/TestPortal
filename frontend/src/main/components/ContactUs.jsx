import React, { useState } from "react";
import Swal from "sweetalert2";
import {
  Mail,
  Phone,
  MapPin,
  SendHorizontal,
  User,
  MessageSquareText,
  BookOpen,
} from "lucide-react"; 

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "success",
      title: "Message Sent",
      text: "Thank you for contacting us. We’ll be in touch shortly.",
    });

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <>
       <div className="min-h-screen bg-[#F9F3EF] py-16 px-4 sm:px-6 lg:px-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-2">
            <span className="text-[#1B3C53]">Contact</span>{" "}
            <span className="text-[#456882]">Us</span>
          </h2>
          <p className="text-[#456882] max-w-xl mx-auto">
            We’d love to hear from you! Whether you have a question, feedback,
            or just want to say hello.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap- max-w-6xl mx-auto">
          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#D2C1B6] rounded-2xl p-8  shadow-sm space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 text-[#1B3C53] font-medium flex items-center gap-2">
                  <User className="w-5 h-5" /> Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-[#D2C1B6] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#456882]"
                />
              </div>

              <div>
                <label className="block mb-1 text-[#1B3C53] font-medium flex items-center gap-2">
                  <Mail className="w-5 h-5" /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-[#D2C1B6] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#456882]"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-[#1B3C53] font-medium flex items-center gap-2">
                <MessageSquareText className="w-5 h-5" /> Subject
              </label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full border border-[#D2C1B6] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#456882]"
              />
            </div>

            <div>
              <label className="block mb-1 text-[#1B3C53] font-medium flex items-center gap-2">
                <MessageSquareText className="w-5 h-5" /> Message
              </label>
              <textarea
                name="message"
                rows="5"
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-[#D2C1B6] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#456882]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 flex justify-center items-center gap-2 bg-[#456882] hover:bg-[#1B3C53] text-white font-semibold rounded-lg transition"
            >
              <SendHorizontal className="w-5 h-5" />
              Send Message
            </button>
          </form>
          {/* Contact Info Section as Separate Cards */}
          <div className="grid pl-20  w-110 grid-cols-1 gap-6  ">
            {/* Address Card */}
            <div className="bg-white border border-[#D2C1B6] rounded-xl p-10 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-4 mb-4">
                <MapPin className="w-6 h-6 text-[#1B3C53]" />
                <h4 className="text-lg font-semibold text-[#1B3C53]">
                  Address
                </h4>
              </div>
              <p className="text-[#456882]">
                123 Education Street, New Delhi, India
              </p>
            </div>

            {/* Phone Card */}
            <div className="bg-white border border-[#D2C1B6] rounded-xl p-10 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-4 mb-4">
                <Phone className="w-6 h-6 text-[#1B3C53]" />
                <h4 className="text-lg font-semibold text-[#1B3C53]">Phone</h4>
              </div>
              <p className="text-[#456882]">+91 98765 43210</p>
            </div>

            {/* Email Card */}
            <div className="bg-white border border-[#D2C1B6] rounded-xl p-10 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-4 mb-4">
                <Mail className="w-6 h-6 text-[#1B3C53]" />
                <h4 className="text-lg font-semibold text-[#1B3C53]">Email</h4>
              </div>
              <p className="text-[#456882]">support@testportal.com</p>
            </div>
          </div>
        </div>
      </div>
     </>
  );
};

export default ContactUs;
