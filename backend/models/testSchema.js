const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },

    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],

    duration: { type: Number, default: 30 }, // minutes
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
    totalMarks: { type: Number, default: 0 },

    // 👇 Track who created the test
    createdBy: {
      type: String,
      enum: ["admin", "vendor"], // who created it
      required: true,
    },

    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: function () {
        return this.createdBy === "vendor"; // vendorId required only if vendor created it
      },
    },

    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Test", testSchema);
