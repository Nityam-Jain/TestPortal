const Question = require("../models/Question");

  
 exports.createQuestion = async (req, res) => {
  try {
    if (!req.vendor) {
      return res.status(401).json({ message: "Vendor not authenticated" });
    }

    const data = req.body;

    // Case 1: Multiple questions
    if (Array.isArray(data)) {
      const formattedQuestions = data.map((q) => ({
        vendorId: req.vendor._id,
        courseId: q.courseId,
        subjectId: q.subjectId,
        categoryId: q.categoryId,
        questionText: q.text || q.questionText, // handle both formats
        options: q.options,
        correctAnswer: q.correctAnswer,
      }));

      const savedQuestions = await Question.insertMany(formattedQuestions);
      return res.status(201).json({ message: "Questions created", questions: savedQuestions });
    }

    // Case 2: Single question
    const { courseId, subjectId, categoryId, questionText, options, correctAnswer } = data;

    const question = new Question({
      vendorId: req.vendor._id,
      courseId,
      subjectId,
      categoryId,
      questionText,
      options,
      correctAnswer,
    });

    await question.save();
    res.status(201).json({ message: "Question created", question });

  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({ message: "Server error creating question" });
  }
};


// Get all questions for vendor
exports.getQuestionsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const questions = await Question.find({
      vendorId: req.vendor._id,
      categoryId,
    })
      .populate("courseId", "name")
      .populate("subjectId", "name")
      .populate("categoryId", "name");

    res.json({ questions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Update question
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Question.findOneAndUpdate(
      { _id: id, vendorId: req.vendor._id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Question not found" });
    res.json({ message: "Question updated", question: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete question
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Question.findOneAndDelete({ _id: id, vendorId: req.vendor._id });
    if (!deleted) return res.status(404).json({ message: "Question not found" });
    res.json({ message: "Question deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
