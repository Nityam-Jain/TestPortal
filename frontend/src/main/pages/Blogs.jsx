// src/pages/Blogs.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

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
                className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition"
              >
                <img
                  src={typeof blog.image === "string" ? blog.image : ""}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5 flex-1 flex flex-col">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800">
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-2">
                    {blog.highlight}
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    By {blog.author} | {blog.category} | {blog.readTime} |{" "}
                    {blog.date?.split("T")[0]}
                  </p>
                  <p className="text-sm text-gray-700 flex-1 mb-4">
                    {blog.content.length > 120
                      ? blog.content.substring(0, 120) + "..."
                      : blog.content}
                  </p>
                  <button className="w-full bg-slate-600 text-white py-2 px-4 rounded-lg hover:bg-slate-700 transition mt-auto">
                    Read More
                  </button>
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
