const Blog = require("../models/blog");

// @desc   Create new blog
// @route  POST /api/blogs
exports.createBlog = async (req, res) => {
  try {
    const { title, highlight, author, category, readTime, content } = req.body;
    let image = "";

    if (req.file) {
      image = `/uploads/${req.file.filename}`; // multer upload
    } else if (req.body.image) {
      image = String(req.body.image); // URL
    }

    const newBlog = new Blog({
      title,
      highlight,
      image,
      author,
      category,
      readTime,
      content,
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Error creating blog", error });
  }
};

// @desc   Get all blogs
// @route  GET /api/blogs
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error });
  }
};

// @desc   Get single blog by ID
// @route  GET /api/blogs/:id
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ message: "Error fetching blog", error });
  }
};


// @desc   Delete blog
// @route  DELETE /api/blogs/:id
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog", error });
  }
};

// @route  PUT /api/blogs/:id
exports.updateBlog = async (req, res) => {
  try {
    const { title, highlight, author, category, readTime, content } = req.body;
    let image = "";

    if (req.file) {
      image = `/uploads/${req.file.filename}`; // multer upload
    } else if (req.body.image) {
      image = String(req.body.image); // URL
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, highlight, author, category, readTime, content, image },
      { new: true, runValidators: true }
    );

    if (!updatedBlog)
      return res.status(404).json({ message: "Blog not found" });

    res.json(updatedBlog);
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "Error updating blog", error });
  }
}