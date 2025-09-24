import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { User, Calendar, Clock } from "lucide-react";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/blogs/${id}`);
        setBlog(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading blog...</p>;
  }

  if (!blog) {
    return <p className="text-center text-gray-500 mt-10">Blog not found.</p>;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-1 md:p-10 bg-white rounded-xl shadow-lg my-10">
        {/* Image */}
        {blog.image && (
          <img
            src={typeof blog.image === "string" ? blog.image : ""}
            alt={blog.title}
            className="w-full h-72 object-cover rounded-lg mb-6"
          />
        )}

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {blog.title}
        </h1>

        {/* Meta Info */}
        <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
          <span className="flex items-center gap-1">
            <User size={16} /> {blog.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={16} /> {blog.date?.split("T")[0]}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={16} /> {blog.readTime}
          </span>
        </div>

        {/* Highlight */}
        <p className="text-lg text-gray-700 mb-6">{blog.highlight}</p>

        {/* Full Content */}
        <div className="prose max-w-none text-gray-800 leading-relaxed">
          {blog.content}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogDetail;
