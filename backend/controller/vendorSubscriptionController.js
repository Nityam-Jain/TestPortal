const VendorSubscription = require("../models/Vendorsubscription");
const SubscriptionPlan = require("../models/SubscriptionPlan");

exports.getAvailablePlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find();
    res.status(200).json({ plans });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch plans" });
  }
};

exports.purchaseSubscription = async (req, res) => { 
  try {
    const { planId } = req.body;
    const vendorId = req.vendor._id;

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // Calculate endDate (example: 30 days subscription, can be dynamic)
    const durationDays = plan.durationInDays || 30; // fallback to 30 days
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationDays);

    const subscription = await VendorSubscription.create({
      vendorId,
      planId,
      startDate,
      endDate,
      status: "active"
    });

    res.status(201).json({ message: "Subscription purchased successfully", subscription });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to purchase subscription" });
  }
};
