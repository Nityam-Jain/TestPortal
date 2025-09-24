import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Plus, Edit2, User, Calendar, Clock } from "lucide-react";
import Swal from "sweetalert2";

const BlogsManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({
    title: "",
    highlight: "",
    author: "",
    category: "General",
    readTime: "",
    content: "",
    image: "",
  });
  const [editingBlog, setEditingBlog] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const categories = ["General", "Technology", "Business", "Design", "Education", "Other"];

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("/api/blogs");
        setBlogs(res.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };
    fetchBlogs();
  }, []);

  const handleChange = (e) => {
    setNewBlog({ ...newBlog, [e.target.name]: e.target.value });
  };

 const handleAddBlog = async (e) => {
  e.preventDefault();
  if (!newBlog.title || !newBlog.author || !newBlog.content) return;

  // Confirm before create/update
  const result = await Swal.fire({
    title: editingBlog ? "Update this blog?" : "Create new blog?",
    text: editingBlog
      ? "Are you sure you want to update this blog?"
      : "Do you want to create this new blog?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#000",
    cancelButtonColor: "#d33",
    confirmButtonText: editingBlog ? "Yes, update it!" : "Yes, create it!",
  });

  if (!result.isConfirmed) return;

  try {
    let res;
    if (newBlog.image instanceof File) {
      const formData = new FormData();
      formData.append("image", newBlog.image);
      formData.append("title", newBlog.title);
      formData.append("highlight", newBlog.highlight);
      formData.append("author", newBlog.author);
      formData.append("category", newBlog.category);
      formData.append("readTime", newBlog.readTime);
      formData.append("content", newBlog.content);

      if (editingBlog) {
        res = await axios.put(`/api/blogs/${editingBlog._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axios.post("/api/blogs", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
    } else {
      const payload = {
        title: newBlog.title,
        highlight: newBlog.highlight,
        author: newBlog.author,
        category: newBlog.category,
        readTime: newBlog.readTime,
        content: newBlog.content,
        image: newBlog.image || "",
      };

      if (editingBlog) {
        res = await axios.put(`/api/blogs/${editingBlog._id}`, payload);
      } else {
        res = await axios.post("/api/blogs", payload);
      }
    }

    if (editingBlog) {
      setBlogs(blogs.map((b) => (b._id === editingBlog._id ? res.data : b)));
      setEditingBlog(null);
    } else {
      setBlogs([res.data, ...blogs]);
    }

    Swal.fire(
      "Success!",
      editingBlog ? "Blog updated successfully." : "Blog created successfully.",
      "success"
    );

    setShowModal(false);
    setNewBlog({
      title: "",
      highlight: "",
      author: "",
      category: "General",
      readTime: "",
      content: "",
      image: "",
    });
  } catch (err) {
    console.error("Error saving blog:", err);
    Swal.fire("Error!", "Something went wrong while saving blog.", "error");
  }
};

const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This action cannot be undone!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (!result.isConfirmed) return;

  try {
    await axios.delete(`/api/blogs/${id}`);
    setBlogs(blogs.filter((blog) => blog._id !== id));
    Swal.fire("Deleted!", "Blog has been deleted.", "success");
  } catch (err) {
    console.error("Error deleting blog:", err);
    Swal.fire("Error!", "Failed to delete blog.", "error");
  }
};


  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setNewBlog(blog);
    setShowModal(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Blogs</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          <Plus size={18} /> {editingBlog ? "Edit Blog" : "Add Blog"}
        </button>
      </div>


      {/* Blog Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
          >
            {/* Blog Image */}
            <img
              src={typeof blog.image === "string" ? blog.image : ""}
              alt={blog.title}
              className="h-40 w-full object-cover"
            />

            {/* Blog Content */}
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-lg font-bold mb-1">{blog.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{blog.highlight}</p>

              {/* Author + Date + Read Time */}
              <div className="flex items-center text-xs text-gray-500 gap-4 mb-3">
                <span className="flex items-center gap-1">
                  <User size={14} /> {blog.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> {blog.date?.split("T")[0]}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {blog.readTime}
                </span>
              </div>

              {/* Short Content Preview */}
              <p className="text-sm text-gray-700 flex-1">
                {blog.content.length > 120
                  ? blog.content.substring(0, 120) + "..."
                  : blog.content}
              </p>

              {/* Action Buttons */}
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleEdit(blog)}
                  className="p-2 hover:bg-blue-100 rounded"
                >
                  <Edit2 size={18} className="text-blue-600" />
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="p-2 hover:bg-red-100 rounded"
                >
                  <Trash2 size={18} className="text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {blogs.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No blogs available.
          </p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-6 relative">
            <button
              onClick={() => {
                setShowModal(false);
                setEditingBlog(null);
              }}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-6">
              {editingBlog ? "Edit Blog" : "Create Blog"}
            </h3>
            <form onSubmit={handleAddBlog} className="grid gap-4">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Blog Name</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter Blog Name"
                    value={newBlog.title}
                    onChange={handleChange}
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Highlighted Content</label>
                  <input
                    type="text"
                    name="highlight"
                    placeholder="Enter highlighted content"
                    value={newBlog.highlight}
                    onChange={handleChange}
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Author Name</label>
                  <input
                    type="text"
                    name="author"
                    placeholder="Enter author name"
                    value={newBlog.author}
                    onChange={handleChange}
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    name="category"
                    value={newBlog.category}
                    onChange={handleChange}
                    className="border rounded px-3 py-2 w-full"
                  >
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Read Time</label>
                  <input
                    type="text"
                    name="readTime"
                    placeholder="e.g. 5 min"
                    value={newBlog.readTime}
                    onChange={handleChange}
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setNewBlog({ ...newBlog, image: e.target.files[0] })
                    }
                    className="border rounded px-3 py-2 w-full"
                  />
                  {/* <input
                    type="text"
                    placeholder="Or paste image URL"
                    value={typeof newBlog.image === "string" ? newBlog.image : ""}
                    onChange={(e) => setNewBlog({ ...newBlog, image: e.target.value })}
                    className="border rounded px-3 py-2 w-full"
                  /> */}
                </div>
              </div>
              {/* Content */}
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  name="content"
                  placeholder="Enter blog content"
                  rows="5"
                  value={newBlog.content}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 w-full"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 mt-2"
              >
                {editingBlog ? "Update Blog" : "Create Blog"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogsManager;
