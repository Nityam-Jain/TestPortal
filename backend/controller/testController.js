const Test = require("../models/testSchema");
const Course = require("../models/Course");
const Subject = require("../models/Subject");
const Category = require("../models/Category");
const Question = require("../models/Question");

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

    // Validate references
    const course = await Course.findById(courseId);
    const subject = await Subject.findById(subjectId);
    const category = await Category.findById(categoryId);

    if (!course || !subject || !category) {
      return res.status(400).json({ message: "Invalid course/subject/category" });
    }

    // Decide creator (comes from auth middleware)
    let createdBy = req.user.role.toLowerCase(); // "admin" | "vendor"
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

// Get all tests (Admin/Vendor dashboard)
module.exports.getAllTests = async (req, res) => {

  try {
    let filter = {};

    if (req.user.role === "vendor") {
      filter.vendorId = req.user.id; // vendor sees only own tests
    }

    if (req.user.role === "user") {
     if (req.user.vendorId) {
  filter.vendorId = req.user.vendorId;
 
}
    }

    const tests = await Test.find(filter)
      .populate("courseId", "name")
      .populate("subjectId", "name")
      .populate("categoryId", "name")
      .populate("vendorId", "username email");

    res.json(tests);
  } catch (error) {
    console.error("Error fetching tests:", error);
    res.status(500).json({
      message: "Failed to fetch tests",
      error: error.message,
    });
  }
};



// Get Public Tests (for users, filterable)
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

// Get Single Test with questions
module.exports.getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate("courseId", "name description")
      .populate("subjectId", "name")
      .populate("categoryId", "name")
      .populate("questions")
      .populate("vendorId", "username email"); // vendor info

    if (!test) return res.status(404).json({ message: "Test not found" });

    res.json(test);
  } catch (err) {
    res.status(500).json({ message: "Error fetching test", error: err.message });
  }
};

// Update Test
module.exports.updateTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!test) return res.status(404).json({ message: "Test not found" });

    res.json(test);
  } catch (err) {
    res.status(500).json({ message: "Error updating test", error: err.message });
  }
};

// Delete Test
module.exports.deleteTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ message: "Test not found" });

    // Vendors can only delete their own tests
    if (req.user.role === "vendor" && test.vendorId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this test" });
    }

    await test.deleteOne();
    res.json({ message: "Test deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting test", error: err.message });
  }
};

