const Test = require("../models/testSchema");
const Course = require("../models/Course");
const Subject = require("../models/Subject");
const Category = require("../models/Category");

// Create Test
module.exports.createTest = async (req, res) => {
  try {
    const {
      title,
      description,
      courseId,
      subjectId,
      categoryId,
      questions,
      duration,
      difficulty,
      totalMarks,
      isPublic,
    } = req.body;

    const course = await Course.findById(courseId);
    const subject = await Subject.findById(subjectId);
    const category = await Category.findById(categoryId);

    if (!course || !subject || !category) {
      return res.status(400).json({ message: "Invalid course/subject/category" });
    }

    let createdBy = req.user.role.toLowerCase();
    let vendorId = createdBy === "vendor" ? req.user.id : null;

    const test = new Test({
      title,
      description,
      courseId,
      subjectId,
      categoryId,
      questions,
      duration,
      difficulty,
      totalMarks,
      isPublic,
      createdBy,
      vendorId,
    });

    await test.save();
    res.status(201).json({ message: "Successfully created test", test });
  } catch (err) {
    console.error("Error creating test:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all tests
module.exports.getAllTests = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "vendor") {
      filter.vendorId = req.user.id;
    }

    if (req.user.role === "user" && req.user.vendorId) {
      filter.vendorId = req.user.vendorId;
    }

    const tests = await Test.find(filter)
      .populate("courseId", "name")
      .populate("subjectId", "name")
      .populate("categoryId", "name")
      .populate("vendorId", "username email");

    res.json(tests);
  } catch (error) {
    console.error("Error fetching tests:", error);
    res.status(500).json({ message: "Failed to fetch tests", error: error.message });
  }
};

// Get public tests
module.exports.getPublicTests = async (req, res) => {
  try {
    const { courseId, subjectId, categoryId } = req.query;
    let query = { isPublic: true };

    if (courseId) query.courseId = courseId;
    if (subjectId) query.subjectId = subjectId;
    if (categoryId) query.categoryId = categoryId;

    const tests = await Test.find(query)
      .populate("courseId", "name")
      .populate("subjectId", "name")
      .populate("categoryId", "name");

    res.json(tests);
  } catch (err) {
    console.error("Error fetching public tests:", err);
    res.status(500).json({ message: "Error fetching public tests", error: err.message });
  }
};

// Get single test with questions populated
module.exports.getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate("courseId", "name description")
      .populate("subjectId", "name")
      .populate("categoryId", "name")
      .populate({
        path: "questions",
        select: "questionText options correctAnswer courseId subjectId categoryId",
        populate: [
          { path: "courseId", select: "name" },
          { path: "subjectId", select: "name" },
          { path: "categoryId", select: "name" }
        ]
      })
      .populate("vendorId", "username email");

    if (!test) return res.status(404).json({ message: "Test not found" });

    res.json(test);
  } catch (err) {
    console.error("Error fetching test:", err);
    res.status(500).json({ message: "Error fetching test", error: err.message });
  }
};

// Update test
module.exports.updateTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!test) return res.status(404).json({ message: "Test not found" });
    res.json(test);
  } catch (err) {
    console.error("Error updating test:", err);
    res.status(500).json({ message: "Error updating test", error: err.message });
  }
};

// Delete test
module.exports.deleteTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ message: "Test not found" });

    if (req.user.role === "vendor" && test.vendorId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this test" });
    }

    await test.deleteOne();
    res.json({ message: "Test deleted successfully" });
  } catch (err) {
    console.error("Error deleting test:", err);
    res.status(500).json({ message: "Error deleting test", error: err.message });
  }
};
