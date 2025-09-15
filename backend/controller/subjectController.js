const Subject = require("../models/Subject");

// Create Subject
exports.createSubject = async (req, res) => {
  try {
    const { name, description, courseId } = req.body;

    const newSubject = await Subject.create({
      name,
      description,
      courseId,
      createdBy: req.user.role, // "admin" or "vendor"
      vendorId: req.user.role === "vendor" ? req.user.id : null,
    });

    res.status(201).json({ success: true, subject: newSubject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Subjects by Course
exports.getSubjectsByCourse = async (req, res) => {
  try {
    let filter = { courseId: req.params.courseId };

    // Vendor should only see their own subjects
    if (req.userRole === "vendor") {
      filter.createdBy = "vendor";
      filter.vendorId = req.userId;
    }

    const subjects = await Subject.find(filter);
    res.json({ success: true, subjects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Subject
exports.updateSubject = async (req, res) => {
  try {
    let filter = { _id: req.params.id };

    // Vendor can only update their own subjects
    if (req.userRole === "vendor") {
      filter.createdBy = "vendor";
      filter.vendorId = req.userId;
    }

    const updatedSubject = await Subject.findOneAndUpdate(
      filter,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedSubject) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized or subject not found" });
    }

    res.json({ success: true, subject: updatedSubject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Subject
exports.deleteSubject = async (req, res) => {
  try {
    let filter = { _id: req.params.id };

    // Vendor can only delete their own subjects
    if (req.userRole === "vendor") {
      filter.createdBy = "vendor";
      filter.vendorId = req.userId;
    }

    const deletedSubject = await Subject.findOneAndDelete(filter);

    if (!deletedSubject) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized or subject not found" });
    }

    res.json({ success: true, message: "Subject deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Public Endpoint: Get Published Subjects by Course (for students/users)
exports.getPublicSubjectsByCourse = async (req, res) => {
  try {
    const subjects = await Subject.find({
      courseId: req.params.courseId,
      isPublished: true,
    });

    res.json({ success: true, subjects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
