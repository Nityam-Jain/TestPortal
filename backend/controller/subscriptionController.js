const SubscriptionPlan = require("../models/SubscriptionPlan");

// Add new subscription plan
exports.addSubscriptionPlan = async (req, res) => {
  try {
    const { planName, price, description, features } = req.body;

    const newPlan = new SubscriptionPlan({
      planName,
      price,
      description,
      features,
    });

    await newPlan.save();
    res.status(201).json({ message: "Subscription Plan created successfully", plan: newPlan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating plan" });
  }
};

// Get all subscription plans
exports.getPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: "Error fetching plans" });
  }
};

// Update subscription plan
exports.updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { planName, price, description, features } = req.body;

    const updatedPlan = await SubscriptionPlan.findByIdAndUpdate(
      id,
      { planName, price, description, features },
      { new: true, runValidators: true }
    );

    if (!updatedPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.json({
      message: "Subscription Plan updated successfully",
      plan: updatedPlan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating plan" });
  }
};

// Delete subscription plan
exports.deletePlan = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPlan = await SubscriptionPlan.findByIdAndDelete(id);

    if (!deletedPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.json({ message: "Subscription Plan deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting plan" });
  }
};