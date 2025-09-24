// routes/blogRoutes.js
const express = require("express");
const router = express.Router();
const { createBlog, getBlogs, deleteBlog, updateBlog, getBlogById } = require("../controller/blogController");
const multer = require("multer");

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // create an "uploads" folder in root
  },
  filename: (req, file, cb) => { 
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Routes
// Create blog
router.post("/", upload.single("image"), createBlog);

// Get all blogs
router.get("/", getBlogs);

// Get single blog
router.get("/:id", getBlogById);

// Update blog
router.put("/:id", upload.single("image"), updateBlog);

// Delete blog
router.delete("/:id", deleteBlog);
module.exports = router;
