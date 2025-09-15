const express = require ("express");
const { login, UserSignup, signupVendor, getUserProfile, updateUserProfile, getVendorProfile, updateVendorProfile, } = require("../controller/AuthController");
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");
const { getVendorStudents, addStudent, editStudent, deleteStudent } = require("../controller/VendorController");
const router = express.Router();

router.post("/signupVendor", signupVendor);
router.post("/UserSignup", upload.single("profileImage"), UserSignup);
router.post('/login', login);    
router.get("/profile", authMiddleware, getUserProfile, updateUserProfile);
router.put("/profile/updateUserProfile", authMiddleware,  updateUserProfile);
router.get('/vendorprofile', authMiddleware, getVendorProfile);
router.put("/vendorprofile/updateUserProfile",authMiddleware, updateVendorProfile);


router.post("/students",  upload.single("profileImage"),authMiddleware, addStudent);
router.get("/:vendorId/students", authMiddleware, getVendorStudents);
  router.put("/editStudent/:id", authMiddleware, upload.single("profileImage"), editStudent);
 router.delete("/deleteStudent/:id", authMiddleware, deleteStudent);
module.exports = router;

