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
//get all users
 module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
   } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Update user by ID (excluding password)
module.exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure password is not updated
    if (req.body.password) delete req.body.password;

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to update user" });
  }
};


// Delete user by ID
module.exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};



//get vendor details
 module.exports. getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().select("-password");
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vendors" });
  }
};

// ✅ Update vendor by ID
module.exports.updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedVendor = await Vendor.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json(updatedVendor);
  } catch (error) {
    res.status(500).json({ message: "Failed to update vendor" });
  }
};

// ✅ Delete vendor by ID
module.exports.deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVendor = await Vendor.findByIdAndDelete(id);

    if (!deletedVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({ message: "Vendor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete vendor" });
  }
};
