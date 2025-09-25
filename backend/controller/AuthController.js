const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const Vendor = require('../models/Vendor');
const dotenv = require("dotenv"); 
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (id, role) =>
  jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '7d' });
 

const signupVendor = async (req, res) => {
  const { username, email, mobile, address, businessName, idProofName, idProofNumber, password } = req.body;
  try {

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor)
      return res.status(400).json({ message: 'User already exists as vendor' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const vendor = await Vendor.create({ username, email, mobile, address, businessName, idProofName, idProofNumber, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {

    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const UserSignup = async (req, res) => {
  const {
    username,
    email,
    phone,
    gender,
    dob,
    grade,
    institutionType,
    institutionName,
    stream,
    password,
    vendorId,

  } = req.body;

  try {
    // Check if email already exists as User
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check if email already exists as Vendor
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ message: "User already exists as vendor" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profileImage = req.file ? req.file.filename : null;

    const user = await User.create({
      username,
      email,
      phone,
      gender,
      dob: new Date(new Date(dob).toDateString()),
      grade,
       institutionType,   // ✅ fixed
      institutionName,   // ✅ fixed
      stream, 
      profileImage: profileImage || null,
      vendorId: vendorId || null,
      password, 
      role: "user", 
    });

    res.status(201).json({ message: "User registered successfully", role: user.role });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}; 

// Bulk Upload Users (CSV or JSON array)
// @route POST /api/auth/students/bulk
const bulkUploadUsers = async (req, res) => {  
  try {

    // console.log("Request body:", req.body); // 👈 check what is received

    const {users} = req.body; // Expecting an array of user objects

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ message: "No users provided" });
    }

    // Hash passwords before saving
    const usersToInsert = await Promise.all(
      users.map(async (u) => {
        const existingUser = await User.findOne({ email: u.email });
        if (existingUser) {
          return null; // skip duplicates
        }

        const hashedPassword = await bcrypt.hash(u.password || "123456", 10);

        return {
          username: u.username,
          email: u.email,
          phone: u.phone,
          gender: u.gender,
          dob: u.dob ? new Date(new Date(u.dob).toDateString()) : null,
          grade: u.grade,
          institutionType: u.institutionType,
          institutionName: u.institutionName,
          stream: u.stream,
          profileImage: u.profileImage || null,
          vendorId: u.vendorId || null,
          password: hashedPassword,
          role: "user",
        };
      })
    );

    // Filter out skipped (null) users
    const filteredUsers = usersToInsert.filter((u) => u !== null);

    if (filteredUsers.length === 0) {
      return res.status(400).json({ message: "All users already exist" });
    }

    // Insert in bulk
    await User.insertMany(filteredUsers);

    res
      .status(201)
      .json({ message: "Users uploaded successfully", count: filteredUsers.length });
  } catch (err) {
    console.error("Bulk Upload Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc   Search users
// @route  GET /api/users/search?query=abc
// @access Public (or protect with middleware if needed)
const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Please provide a search query" });
    }

    // Case-insensitive partial match on username, email, or institutionName
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { institutionName: { $regex: query, $options: "i" } },
      ],
    }).select("-password"); // Exclude password field

    res.json(users);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    // Try logging in as a vendor first
    const vendor = await Vendor.findOne({ email: emailOrUsername });
    if (vendor) {
      const isMatch = await bcrypt.compare(password, vendor.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

      const token = jwt.sign({ id: vendor._id, role: 'vendor' }, JWT_SECRET, {
        expiresIn: '7d'
      });

      return res.status(200).json({
        token,
        user: {
          id: vendor._id,
          name: vendor.name,
          email: vendor.email,
          role: 'vendor'
        }
      });
    }

 // Try logging in as a user (using username)
   const user = await User.findOne({ email: emailOrUsername });
if (!user) {
  return res.status(404).json({ message: "User not found" });
}

// ✅ Check password
const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
  return res.status(401).json({ message: "Invalid password" });
}

// ✅ Build token payload (include vendorId if exists)
const payload = {
  id: user._id,
  role: user.role || "user",
  vendorId: user.vendorId || null, // 👈 important
};

// ✅ Generate JWT
const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

// ✅ Response (send vendorId to frontend as well)
return res.status(200).json({
  token,
  user: {
    id: user._id,
    name: user.username,
    email: user.email,
    role: user.role,
    vendorId: user.vendorId || null, // 👈 include here too
  },
});


    return res.status(404).json({ message: 'Account not found' });

  } catch (err) { 
    console.log(err)
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};



const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

const getVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.user.id).select("-password");
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.status(200).json(vendor);
  } catch (error) {
    console.error("Error fetching vendor profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateVendorProfile = async (req, res) => {
  try {
    const {
      username,
      name,
      email,
      mobile,
      address,
      businessName,
      idProofName,
      idProofNumber,
    } = req.body;

    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.user.id,
      {
        username,
        name,
        email,
        mobile,
        address,
        businessName,
        idProofName,
        idProofNumber,
      },
      {
        new: true,
        runValidators: true, // apply schema validators
      }
    ).select("-password");

    if (!updatedVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      vendor: updatedVendor,
    });
  } catch (error) {
    console.error("Error updating vendor profile:", error);
    res.status(500).json({ message: "Failed to update vendor profile" });
  }
};


const updateUserProfile = async (req, res) => {
  try {
    const updates = req.body; // Expecting fields like name, phone, etc.

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true, context: 'query' }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  signupVendor,
  UserSignup,
  login,
  getUserProfile,
  updateUserProfile,
  getVendorProfile,
  updateVendorProfile,
  bulkUploadUsers,
  searchUsers
};
