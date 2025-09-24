const express = require("express");
const router = express.Router();
const { addSubscriptionPlan, getPlans, updatePlan,  deletePlan, } = require("../controller/subscriptionController");

// Add new plan
router.post("/", addSubscriptionPlan);

// Get all plans
router.get("/", getPlans);


// Update plan
router.put("/:id", updatePlan);

// Delete plan
router.delete("/:id", deletePlan);

module.exports = router;
