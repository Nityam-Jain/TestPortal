const express = require("express");
const router = express.Router();
const subjectController = require("../controller/subjectController");

const auth = require("../middleware/auth");

// 🔹 Admin/Vendor Protected Routes
router.post("/", auth, subjectController.createSubject);
router.get("/:courseId", auth, subjectController.getSubjectsByCourse);
router.put("/:id", auth, subjectController.updateSubject);
router.delete("/:id", auth, subjectController.deleteSubject);

// 🔹 Public Route (for students/users) → only published subjects
router.get("/public/:courseId", subjectController.getPublicSubjectsByCourse);

module.exports = router;
