const Course = require("../models/Course");
const Subject = require("../models/Subject");
const Category = require("../models/Category");

// Create Course
exports.createCourse = async (req, res) => {
  try {
    const { name, description } = req.body;
     const newCourse = new Course({
      name,
      description,
      createdBy: req.user.role, // "admin" or "vendor"
      vendorId: req.user.role === "vendor" ? req.user.id : null,

    });

    await newCourse.save();
    res.status(201).json({ success: true, message: "Course created", course: newCourse });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get All Courses
exports.getCourses = async (req, res) => {
  try {
    let filter = {};

    if (req.userRole === "vendor") {
      filter = { createdBy: "vendor", vendorId: req.user.id };
    }
    // Admin will see all

    const courses = await Course.find(filter);
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete Course
exports.deleteCourse = async (req, res) => {
  try {
    let filter = { _id: req.params.id };

    if (req.userRole === "vendor") {
      filter = { ...filter, createdBy: "vendor", vendorId: req.userId };
    }

    const deleted = await Course.findOneAndDelete(filter);
    if (!deleted) {
      return res.status(403).json({ success: false, message: "Not authorized or course not found" });
    }

    res.json({ success: true, message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Course Hierarchy (Courses → Subjects → Categories)
exports.getCourseHierarchy = async (req, res) => {
  try {
    let courseFilter = {};
    console.log(req)
    if (req.user.role === "vendor") {
      courseFilter = { createdBy: "vendor", vendorId: req.user.id };
    }

    const courses = await Course.find(courseFilter);

    const result = await Promise.all(
      courses.map(async (course) => {
        const subjects = await Subject.find({ courseId: course._id });
        const subjectsWithCategories = await Promise.all(
          subjects.map(async (subj) => {
            const categories = await Category.find({ subjectId: subj._id });
            return { ...subj.toObject(), categories };
          })
        );
        return { ...course.toObject(), subjects: subjectsWithCategories };
      })
    );

    res.json({ success: true, courses: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Course
exports.updateCourse = async (req, res) => {
  try {
    const { name, description } = req.body;
    let filter = { _id: req.params.id };

    if (req.userRole === "vendor") {
      filter = { ...filter, createdBy: "vendor", vendorId: req.userId };
    }

    const updatedCourse = await Course.findOneAndUpdate(
      filter,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(403).json({ success: false, message: "Not authorized or course not found" });
    }

    res.json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Public Course Hierarchy (for students/users)
exports.getPublicCourseHierarchy = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true });

    const result = await Promise.all(
      courses.map(async (course) => {
        const subjects = await Subject.find({ courseId: course._id });
        const subjectsWithCategories = await Promise.all(
          subjects.map(async (subj) => {
            const categories = await Category.find({ subjectId: subj._id });
            return { ...subj.toObject(), categories };
          })
        );
        return { ...course.toObject(), subjects: subjectsWithCategories };
      })
    );

    res.json({ success: true, courses: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
