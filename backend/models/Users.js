const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true }, 
    email: { type: String, required: true, unique: true },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    phone: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, "Phone number must be 10 digits"],
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    dob: { type: Date, required: true },

    grade: { type: String, required: true },

    institutionType: {
      type: String,
      enum: ["School", "College"],
      required: true,
    },

    institutionName: { type: String, required: true },

    stream: { type: String, required: true }, // NEW FIELD

    profileImage: { type: String },

    role: {
      type: String,
      enum: ["user"],
      default: "user",
    },

    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// 🔹 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 🔹 Method to compare password during login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
