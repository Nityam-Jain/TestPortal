const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure role is admin
    if (!decoded || decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only" });
    }

    // Optionally fetch full admin from DB
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    req.admin = admin; // attach admin object
    next();
  } catch (err) {
    console.error("Admin auth failed:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { adminAuth };
