const VendorSubscription = require("../models/VendorSubscription");

const checkSubscription = async (req, res, next) => {
  try {
    const vendorId = req.vendor._id; // from vendorAuth
    const subscription = await VendorSubscription.findOne({
      vendorId,
      status: "active",
      endDate: { $gte: new Date() }, // subscription still valid
    });

    if (!subscription) {
      return res.status(403).json({
        message: "You need an active subscription to perform this action."
      });
    }

    req.subscription = subscription; // optional: attach subscription to request
    next();
  } catch (err) {
    console.error("Subscription check failed:", err);
    res.status(500).json({ message: "Subscription verification failed" });
  }
};

module.exports = checkSubscription;
