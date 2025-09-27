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

    // **New field for unique institute ID**
    instituteId: {
      type: String,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// **Pre-save hook to generate instituteId**
vendorSchema.pre("save", async function (next) {
  if (!this.instituteId) {
    const Vendor = mongoose.model("Vendor");
    const count = await Vendor.countDocuments();
    const numberPart = String(count + 1).padStart(3, "0"); // 1 -> 001
    this.instituteId = `TPBIN-${numberPart}`; 
  }
  next();
});

module.exports = mongoose.model("Vendor", vendorSchema);
