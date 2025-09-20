const Result = require("../models/Result");
const Test = require("../models/testSchema");
const Question = require("../models/Question");

// Submit result after test completion
exports.submitResult = async (req, res) => {
  try {
    const { testId } = req.params;
    const { answers, studentId } = req.body; // ✅ take studentId from body

    // 1. Get test details
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    const totalMarks = test.totalMarks || 0;

    // 2. Fetch questions for this test's category
    const questions = await Question.find({ categoryId: test.categoryId });

    // 3. Calculate score
    let score = 0;
    questions.forEach((question) => {
      const studentAnswer = answers.find(ans => ans.questionId === question._id.toString());
      if (studentAnswer && studentAnswer.answer === question.correctAnswer) {
        score += totalMarks / questions.length;
      }
    });

    // 4. Save result
    const result = new Result({
      studentId,
      testId,
      answers: answers.map(ans => ({
        questionId: ans.questionId,
        answers: ans.answers,  // ✅ matches schema
      })),
      score,
      totalMarks
    });


    await result.save();

    res.status(201).json({ message: "Result submitted successfully", result });
  } catch (error) {
    console.error("Error submitting result:", error);
    res.status(500).json({ message: "Server error submitting result" });
  }
};

// Get result overview for a test and student
exports.getResult = async (req, res) => {
  try {
    const { testId } = req.params;
    const { studentId } = req.query; // ✅ take studentId from query for now

    const result = await Result.findOne({ testId, studentId })
      .populate("testId", "name duration totalMarks")
      .populate("studentId", "name email");

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.json({ result });
  } catch (error) {
    console.error("Error fetching result:", error);
    res.status(500).json({ message: "Server error fetching result" });
  }
};
