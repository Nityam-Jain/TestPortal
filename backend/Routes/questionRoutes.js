const express = require("express");
const router = express.Router();
const questionController = require("../controller/questionController");
const { vendorAuth } = require("../middleware/verifyVendor");

// Create question
router.post("/", vendorAuth, questionController.createQuestion);

// Get vendor questions
router.get("/:categoryId",vendorAuth, questionController.getQuestionsByCategory);

// Update question
router.put("/:id", vendorAuth, questionController.updateQuestion);

// Delete question
router.delete("/:id", vendorAuth, questionController.deleteQuestion);

module.exports = router;
