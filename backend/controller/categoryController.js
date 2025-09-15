const Category = require("../models/Category");

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name, description, subjectId } = req.body;

    const newCategory = await Category.create({
      name,
      description,
      subjectId,
      createdBy: req.user.role, // "admin" or "vendor"
      vendorId: req.user.role === "vendor" ? req.user.id : null,
    });

    res.status(201).json({ success: true, category: newCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Categories by Subject
exports.getCategoriesBySubject = async (req, res) => {
  try {
    let filter = { subjectId: req.params.subjectId };

    // Vendor should only see their own categories
    if (req.userRole === "vendor") {
      filter.createdBy = "vendor";
      filter.vendorId = req.user.id;
    }

    const categories = await Category.find(filter);
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  try {
    let filter = { _id: req.params.id };

    // Vendor can only update their own categories
    if (req.userRole === "vendor") {
      filter.createdBy = "vendor";
      filter.vendorId = req.user.id;
    }

    const updatedCategory = await Category.findOneAndUpdate(
      filter,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized or category not found" });
    }

    res.json({ success: true, category: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    let filter = { _id: req.params.id };

    // Vendor can only delete their own categories
    if (req.userRole === "vendor") {
      filter.createdBy = "vendor";
      filter.vendorId = req.user.id;
    }

    const deletedCategory = await Category.findOneAndDelete(filter);

    if (!deletedCategory) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized or category not found" });
    }

    res.json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Public Endpoint: Get Published Categories by Subject (for students/users)
exports.getPublicCategoriesBySubject = async (req, res) => {
  try {
    const categories = await Category.find({
      subjectId: req.params.subjectId,
      isPublished: true,
    });

    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
