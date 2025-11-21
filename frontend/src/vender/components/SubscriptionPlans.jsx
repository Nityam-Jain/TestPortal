// src/vender/pages/SubscriptionPlans.jsx
import React, { useEffect, useState } from "react";

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    // 🔹 Mock static plans
    const mockPlans = [
      {
        _id: "basic123",
        planName: "Basic",
        price: 499,
        durationInDays: 30,
        features: ["Access to tests", "Basic reports"],
      },
      {
        _id: "standard123",
        planName: "Standard",
        price: 999,
        durationInDays: 90,
        features: [
          "Access to tests",
          "Detailed reports",
          "Email support",
        ],
      },
      {
        _id: "premium123",
        planName: "Premium",
        price: 1999,
        durationInDays: 180,
        features: [
          "Unlimited tests",
          "Advanced reports",
          "Priority support",
          "Custom branding",
        ],
      },
    ];

    setTimeout(() => setPlans(mockPlans), 500); // fake API delay
  }, []);

  const handlePurchase = (planId) => {
    alert(`Purchased plan with ID: ${planId}`);
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <div
          key={plan._id}
          className="shadow-lg rounded-lg p-6 bg-white hover:shadow-xl transition"
        >
          <h2 className="text-xl font-bold text-indigo-700">{plan.planName}</h2>
          <p className="text-gray-600 mt-1">₹{plan.price}</p>
          <p className="text-gray-500 mb-3">{plan.durationInDays} days</p>

          <ul className="list-disc pl-5 text-gray-700 space-y-1 mb-4">
            {plan.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>

          <button
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
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
 