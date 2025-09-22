const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    highlights: { type: String }, 
    image: { type: String }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
