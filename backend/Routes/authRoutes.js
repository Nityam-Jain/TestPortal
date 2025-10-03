const express = require("express");
const upload = require("../middleware/upload");
const {
  login,
  UserSignup,
  signupVendor,
  getUserProfile,
  updateUserProfile,
  getVendorProfile,
  updateVendorProfile,
  bulkUploadUsers,
  searchUsers
} = require("../controller/AuthController");

const authMiddleware = require("../middleware/authMiddleware");
const {
  getVendorStudents,
  addStudent,
  editStudent,
  deleteStudent
} = require("../controller/VendorController");

const router = express.Router();

// Signup
router.post("/signupVendor", signupVendor);
router.post("/UserSignup", upload.single("profileImage"), UserSignup);

// Login
router.post('/login', login);

// Profiles
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile/updateUserProfile", authMiddleware, updateUserProfile);
router.get('/vendorprofile', authMiddleware, getVendorProfile);
router.put("/vendorprofile/updateUserProfile", authMiddleware, updateVendorProfile);

// Students (bulk / single)
router.post("/students/bulk", bulkUploadUsers);
router.get("/:vendorId/students", authMiddleware, getVendorStudents);
router.post("/students", upload.single("profileImage"), authMiddleware, addStudent);
router.put("/editStudent/:id", authMiddleware, upload.single("profileImage"), editStudent);
router.delete("/deleteStudent/:id", authMiddleware, deleteStudent);

// User search
router.get("/users/search", searchUsers);

module.exports = router;
