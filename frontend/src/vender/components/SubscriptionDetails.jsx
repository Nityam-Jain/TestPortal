// src/vender/pages/SubscriptionDetails.jsx
import React, { useEffect, useState } from "react";

const SubscriptionDetails = () => {
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    // 🔹 Mock subscription data for now
    const mockData = {
      active: true,
      planName: "Standard",
      startDate: "2025-10-02T12:00:00Z",
      endDate: "2025-11-02T12:00:00Z",
      paymentId: "ed-398d4938",
      createdAt: "2025-09-02T12:45:51Z",
      updatedAt: "2025-10-02T17:04:50Z",
    };

    setTimeout(() => {
      setSubscription(mockData);
    }, 500); // fake loading delay
  }, []);

  if (!subscription) {
    return <p className="p-6">Loading subscription details...</p>;
  }

  if (!subscription.active) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Subscription Details</h2>
        <p>You do not have an active subscription.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Subscription Details</h2>

      {/* Status + Plan Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 rounded shadow bg-white flex justify-between items-center">
          <div>
            <p className="font-semibold">Subscription Status</p>
            <p className="text-green-600 text-lg font-bold mt-1">Active</p>
          </div>
          <span className="px-3 py-1 text-sm rounded bg-green-100 text-green-700 font-medium">
            ACTIVE
          </span>
        </div>
        <div className="p-4 rounded shadow bg-white">
          <p className="font-semibold">Plan Name</p>
          <p className="text-gray-700 text-lg font-bold mt-1">
            {subscription.planName}
          </p>
        </div>
      </div>

      {/* Subscription Period */}
      <div className="p-4 rounded shadow bg-gradient-to-r from-indigo-50 to-purple-50 mb-6">
        <p className="font-semibold mb-2 flex items-center gap-2">
          <span className="text-indigo-600">📅</span> Subscription Period
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          <div>
            <p className="text-sm text-gray-600">Start Date</p>
            <p className="text-green-600 font-bold">
              {new Date(subscription.startDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">End Date</p>
            <p className="text-red-600 font-bold">
              {new Date(subscription.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Payment ID */}
      <div className="p-4 rounded shadow bg-white mb-6">
        <p className="font-semibold mb-2 flex items-center gap-2">
          <span className="text-blue-600">💳</span> Payment ID
        </p>
        <p className="text-gray-700">{subscription.paymentId}</p>
      </div>

      {/* Timeline */}
      <div className="p-4 rounded shadow bg-white">
        <p className="font-semibold mb-2 flex items-center gap-2">
          <span className="text-gray-600">⏱️</span> Timeline
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600">Created</p>
            <p className="text-gray-800">
              {new Date(subscription.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Last Updated</p>
            <p className="text-gray-800">
              {new Date(subscription.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default SubscriptionDetails;
