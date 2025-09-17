const express = require("express");
const router = express.Router();
const resultController = require("../controller/resultController");
const  authMiddleware  = require("../middleware/auth");

// Submit result after test is completed
router.post("/:testId", authMiddleware, resultController.submitResult);

// Get result overview for a test and student
router.get("/:testId", authMiddleware, resultController.getResult);

module.exports = router;
