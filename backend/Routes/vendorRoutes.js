const express = require("express");
const upload = require("../middleware/upload");
const { vendorAuth } = require("../middleware/vendorAuth");
const checkSubscription = require("../middlewares/checkSubscription");
const {
  getVendorStudents,
  addStudent,
  editStudent,
  deleteStudent
} = require("../controller/VendorController");

const {
  getAvailablePlans,
  purchaseSubscription
} = require("../controllers/vendorSubscriptionController");

const router = express.Router();

// Vendor profile
router.get("/profile", vendorAuth, (req, res) => res.json(req.vendor));

// Students (restricted: require subscription)
router.get("/students", vendorAuth, checkSubscription, getVendorStudents);
router.post("/students", vendorAuth, checkSubscription, upload.single("profileImage"), addStudent);
router.put("/students/:id", vendorAuth, checkSubscription, upload.single("profileImage"), editStudent);
router.delete("/students/:id", vendorAuth, checkSubscription, deleteStudent);

// Subscription plans (open for vendors)
router.get("/subscription/plans", vendorAuth, getAvailablePlans);
router.post("/subscription/purchase", vendorAuth, purchaseSubscription);

module.exports = router;
