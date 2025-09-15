const express = require("express");
const router = express.Router();
const courseController = require("../controller/courseController");
 
const auth = require("../middleware/auth");
const { adminAuth } = require("../middleware/verifyAdmin");
 
router.post("/", auth, courseController.createCourse);
router.get("/", auth, courseController.getCourses);
router.get("/hierarchy", auth,courseController.getCourseHierarchy);
 router.delete("/:id", auth, courseController.deleteCourse);
router.put("/:id", auth, courseController.updateCourse);

router.get("/public/hierarchy", courseController.getPublicCourseHierarchy);

module.exports = router;
