// controllers/adminController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const User = require("../models/Users");
const Vendor = require("../models/Vendor");

module.exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // If no admin exists, create one
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await Admin.create({ email, password: hashedPassword });
    }
  
    // Check login
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ Include role in token
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token });
  } catch (err) {
    // console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// Get counts of users and vendors
module.exports.getStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const vendorCount = await Vendor.countDocuments();

    res.status(200).json({
      users: userCount,
      vendors: vendorCount,
      total: userCount + vendorCount,
    });
  } catch (error) {
    // console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

 module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
   } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

 module.exports. getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().select("-password");
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vendors" });
  }
};

