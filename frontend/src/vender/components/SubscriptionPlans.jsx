import React, { useEffect, useState } from "react";
import { getAvailablePlans, purchaseSubscription } from "../components/subscriptionapicall";

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    getAvailablePlans().then((res) => setPlans(res.data.plans));
  }, []);

  const handlePurchase = async (planId) => {
    try {
      await purchaseSubscription(planId);
      alert("Subscription purchased successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to purchase subscription.");
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <div key={plan._id} className="shadow-lg rounded-lg p-6 bg-white">
          <h2 className="text-xl font-bold">{plan.planName}</h2>
          <p className="text-gray-600">₹{plan.price}</p>
          <p className="text-gray-500">{plan.durationInDays} days</p>
          <ul className="list-disc pl-5 text-gray-700">
            {plan.features.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => handlePurchase(plan._id)}
          >
            Purchase
          </button>
        </div>
      ))}
    </div>
  );
};

export default SubscriptionPlans;
