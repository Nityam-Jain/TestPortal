const express = require("express");
const { adminAuth } = require("../middleware/verifyAdmin");
const {
  adminLogin,
  getAllVendors,
  getAllUsers,
  getStats,
  updateVendor,
  deleteVendor,
  updateUser,
  deleteUser
} = require("../controller/AdminController");

const router = express.Router();

// Admin login
router.post("/login", adminLogin);

// Stats
router.get("/stats", adminAuth, getStats);

// Users
router.get("/users", adminAuth, getAllUsers);
router.put("/users/:id", adminAuth, updateUser);
router.delete("/users/:id", adminAuth, deleteUser);

// Vendors
router.get("/vendors", adminAuth, getAllVendors);
router.put("/vendors/:id", adminAuth, updateVendor);
router.delete("/vendors/:id", adminAuth, deleteVendor);

module.exports = router;
