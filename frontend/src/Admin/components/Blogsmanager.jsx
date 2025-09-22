import React, { useState } from "react";
import { Trash2 } from "lucide-react";

const Blogs = () => {
  // Sample blog data
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: "The Future of Web Development",
      author: "Admin",
      date: "2025-09-22",
      content:
        "Web development is evolving rapidly with frameworks like React, Next.js, and AI integrations leading the way...",
    },
    {
      id: 2,
      title: "Why TailwindCSS is Popular",
      author: "Admin",
      date: "2025-09-20",
      content:
        "TailwindCSS provides utility-first classes, making styling faster and more consistent for developers...",
    },
  ]);

  // Form states for adding new blog
  const [newBlog, setNewBlog] = useState({
    title: "",
    author: "",
    content: "",
  });

  // Handle form input
  const handleChange = (e) => {
    setNewBlog({ ...newBlog, [e.target.name]: e.target.value });
  };

  // Add blog
  const handleAddBlog = (e) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.author || !newBlog.content) return;

    const newEntry = {
      id: blogs.length + 1,
      title: newBlog.title,
      author: newBlog.author,
      date: new Date().toISOString().split("T")[0],
      content: newBlog.content,
    };

    setBlogs([newEntry, ...blogs]);
    setNewBlog({ title: "", author: "", content: "" });
  };

  // Delete blog
  const handleDelete = (id) => {
    setBlogs(blogs.filter((blog) => blog.id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Blogs</h2>

      {/* Add Blog Form */}
      <form
        onSubmit={handleAddBlog}
        className="bg-white shadow-md rounded-lg p-4 mb-6"
      >
        <h3 className="text-lg font-semibold mb-3">Create New Blog</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newBlog.title}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:ring-blue-300"
          />
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={newBlog.author}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <textarea
          name="content"
          placeholder="Content"
          rows="4"
          value={newBlog.content}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full mb-4 focus:outline-none focus:ring focus:ring-blue-300"
        ></textarea>
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800"
        >
          Add Blog
        </button>
      </form>

      {/* Blog List */}
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Title</th>
              <th className="p-3">Author</th>
              <th className="p-3">Date</th>
              <th className="p-3">Content</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id} className="bg-white shadow-sm rounded-lg">
                <td className="p-3 font-medium">{blog.title}</td>
                <td className="p-3">{blog.author}</td>
                <td className="p-3">{blog.date}</td>
                <td className="p-3 text-gray-700">
                  {blog.content.length > 80
                    ? blog.content.substring(0, 80) + "..."
                    : blog.content}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-full text-sm hover:bg-red-700"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {blogs.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 p-4">
                  No blogs available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Blogs;
