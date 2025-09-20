const Vendor = require("../models/Vendor");
const User = require("../models/Users");
const dotenv = require("dotenv");
dotenv.config();

// Get all students of a vendor
const getVendorStudents = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const students = await User.find({ vendorId: vendorId }).select("-password"); // hide password
    return res.status(200).json({ students });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add new student
const addStudent = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const {
      username,
      email,
      password,
      phone,
      gender,
      dob,
      grade,
      institutionType,
      institutionName,
      stream,
    } = req.body;

    // Check duplicates
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const profileImage = req.file ? req.file.filename : null;

    const user = await User.create({
      username,
      email,
      password, 
      phone,
      gender,
      dob,
      grade,
      institutionType,
      institutionName,
      stream,
      profileImage: profileImage || null,
      vendorId,
    });

    res
      .status(201)
      .json({ message: "Student created successfully", user: { ...user._doc, password: undefined } });
  } catch (err) {
    console.error("❌ Add Student Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Edit student
const editStudent = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const studentId = req.params.id;

    const updateData = { ...req.body };

    // If password is included, it will be hashed on save
    if (req.file) {
      updateData.profileImage = req.file.filename;
    }

    let student = await User.findOne({ _id: studentId, vendorId });
    if (!student) {
      return res
        .status(404)
        .json({ message: "Student not found or not authorized" });
    }

    Object.assign(student, updateData);
    await student.save(); // ensures password is hashed again if updated

    res.status(200).json({
      message: "Student updated successfully",
      student: { ...student._doc, password: undefined },
    });
  } catch (err) {
    console.error("❌ Edit Student Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const studentId = req.params.id;

    const student = await User.findOneAndDelete({
      _id: studentId,
      vendorId,
    });

    if (!student) {
      return res
        .status(404)
        .json({ message: "Student not found or not authorized" });
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Student Error:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getVendorStudents,
  addStudent,
  editStudent,
  deleteStudent,
};
