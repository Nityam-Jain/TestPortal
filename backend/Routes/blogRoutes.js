// routes/blogRoutes.js
const express = require("express");
const router = express.Router();
const { createBlog, getBlogs, deleteBlog, updateBlog, } = require("../controller/blogController");
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
router.post("/", upload.single("image"), createBlog);
router.get("/", getBlogs);
router.delete("/:id", deleteBlog);
router.put("/:id", upload.single("image"), updateBlog); 

module.exports = router;
