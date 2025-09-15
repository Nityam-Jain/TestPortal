const Vendor = require("../models/Vendor");
const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// Get all students of a vendor
const getVendorStudents = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const students = await User.find({ vendorId: vendorId });
    return res.status(200).json({ students });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add new student
const addStudent = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { username, email, password, phone, gender, dob, grade, school } =
      req.body;

    // Check duplicates
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const profileImage = req.file ? req.file.filename : null;

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      phone,
      gender,
      dob,
      grade,
      school,
      profileImage: profileImage || null,
      vendorId: vendorId,
    });

    res.status(201).json({ message: "Student created successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const editStudent = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const studentId = req.params.id;

    const updateData = { ...req.body };

    // ✅ Prevent duplicate username
    if (updateData.username) {
      const existingUser = await User.findOne({
        username: updateData.username,
        _id: { $ne: studentId }, // exclude the current student
      });
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    if (req.file) {
      updateData.profileImage = req.file.filename;
    }

    const student = await User.findOneAndUpdate(
      { _id: studentId, vendorId: vendorId },
      { $set: updateData },
      { new: true }
    );

    if (!student) {
      return res
        .status(404)
        .json({ message: "Student not found or not authorized" });
    }

    res.status(200).json({ message: "Student updated successfully", student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


// Delete student (by vendor)
const deleteStudent = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const studentId = req.params.id;

    const student = await User.findOneAndDelete({
      _id: studentId,
      vendorId: vendorId,
    });

    if (!student)
      return res
        .status(404)
        .json({ message: "Student not found or not authorized" });

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getVendorStudents,
  addStudent,
  editStudent,
  deleteStudent,
};
