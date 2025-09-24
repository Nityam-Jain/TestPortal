import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { User, Calendar, Clock, Eye } from "lucide-react";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("/api/blogs");
        setBlogs(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6 md:p-10 bg-[#F9F3EF] min-h-screen">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 text-center">
          Latest Blogs
        </h1>
        <p className="text-lg text-[#456882] max-w-2xl mx-auto text-center mb-12">
          Stay updated with our latest articles, tips, and insights.
        </p>

        {loading ? (
          <p className="text-center text-gray-500 mt-8">Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">No blogs available.</p>
        ) : (
          <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <article
                key={blog._id}
                className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition relative"
              >
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow">
                    {blog.category || "Blog"}
                  </span>
                </div>

                {/* Blog Image */}
                <img
                  src={typeof blog.image === "string" ? blog.image : ""}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />

                {/* Blog Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h2 className="text-lg font-bold mb-1 text-gray-800">
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {blog.highlight}
                  </p>

                  {/* Author + Date */}
                  <div className="flex items-center text-xs text-gray-500 gap-4 mb-3">
                    <span className="flex items-center gap-1">
                      <User size={14} /> {blog.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {blog.date?.split("T")[0]}
                    </span>
                  </div>

                  {/* Preview */}
                  <p className="text-sm text-gray-700 flex-1 mb-4">
                    {blog.content.length > 120
                      ? blog.content.substring(0, 120) + "..."
                      : blog.content}
                  </p>

                  {/* Footer (Read time + views + read more link) */}
                  <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {blog.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={14} /> {blog.views || 0}
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(`/blog-details/${blog._id}`)}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      Read More →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Blogs;
