const mongoose = require("mongoose");

const VendorSubscriptionSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: "SubscriptionPlan", required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true }, // calculated from plan duration
  status: { type: String, enum: ["active", "expired"], default: "active" }
}, { timestamps: true });

module.exports = mongoose.model("VendorSubscription", VendorSubscriptionSchema);
