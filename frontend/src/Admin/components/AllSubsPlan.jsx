import React from "react";
import { Edit, Trash2 } from "lucide-react";

const AllSubscriptions = () => {
  const plans = [
    {
      name: "Standard",
      price: 20000,
      credits: 30,
      description:
        "Access to Schedule interviews ",
      features: [
        "Post Jobs",
        "view full profile",
        "schedule Interview",
        "Get latest resumes",
      ],
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">All Subscription Plans</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="bg-gray-300 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Price (₹)</th>
              <th className="p-3">Credits</th>
              <th className="p-3">Description</th>
              <th className="p-3">Features</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan, index) => (
              <tr
                key={index}
                className="bg-white shadow-sm rounded-lg"
              >
                <td className="p-3">{plan.name}</td>
                <td className="p-3">{plan.price}</td>
                <td className="p-3">{plan.credits}</td>
                <td className="p-3">{plan.description}</td>
                <td className="p-3">
                  <ul className="list-disc pl-5">
                    {plan.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </td>
                <td className="p-3 flex gap-2">
                  <button className="flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-full text-sm hover:bg-gray-800">
                    <Edit size={16} /> 
                  </button>
                  <button className="flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-full text-sm hover:bg-red-700">
                    <Trash2 size={16} /> 
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllSubscriptions;
