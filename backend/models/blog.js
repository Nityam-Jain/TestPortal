// models/Blog.js
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    highlight: { type: String },
    image: { type: String },
    author: { type: String, required: true },
    category: { type: String, default: "Technology" },
    readTime: { type: String },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
