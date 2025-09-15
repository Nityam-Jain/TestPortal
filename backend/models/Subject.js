const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },

  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },

  // To track who created this subject
  createdBy: {
    type: String,
    enum: ["admin", "vendor"], // identify if created by admin or vendor
    required: true,
  },

  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor", // Assuming you have a Vendor model
    required: function () {
      return this.createdBy === "vendor"; // vendorId required only if vendor created it
    },
  },

  isPublished: { type: Boolean, default: false }, // subject visibility
}, 
{ timestamps: true });

module.exports = mongoose.model("Subject", subjectSchema);
