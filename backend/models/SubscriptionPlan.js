const mongoose = require("mongoose");

const SubscriptionPlanSchema = new mongoose.Schema({
  planName: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  features: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model("SubscriptionPlan", SubscriptionPlanSchema);
