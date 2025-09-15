 // routes/admin.js
  
 
 const express = require("express");
 const { adminAuth } = require("../middleware/verifyAdmin");  
  const { adminLogin, getAllVendors, getAllUsers, getStats } = require("../controller/AdminController");
const router = express.Router();

router.post("/login", adminLogin);
router.get("/stats", adminAuth, getStats); // show total users/vendors count
router.get("/users", adminAuth, getAllUsers); // list of users
router.get("/vendors", adminAuth, getAllVendors); // list of vendors

module.exports = router;

 