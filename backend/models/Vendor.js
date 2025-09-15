const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    businessName: {
      type: String,
      required: true,
      trim: true,
    },

    idProofName: {
      type: String, // e.g. "Aadhar Card", "PAN Card", "Passport"
      required: true,
      trim: true,
    },

    idProofNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);
