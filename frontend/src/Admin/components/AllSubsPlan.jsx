import React, { useEffect, useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

const AllSubscriptions = () => {
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/subscriptions");
      setPlans(res.data);
    } catch (err) {
      console.error("Error fetching plans:", err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the subscription plan permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/subscriptions/${id}`);
        Swal.fire("Deleted!", "Subscription plan has been deleted.", "success");
        fetchPlans();
      } catch (err) {
        console.error("Delete failed:", err);
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  const handleEdit = (plan) => {
    setCurrentPlan({
      ...plan,
      features: plan.features ? plan.features.join(", ") : "",
    });
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/subscriptions/${currentPlan._id}`,
        {
          planName: currentPlan.planName,
          price: currentPlan.price,
          description: currentPlan.description,
          features: currentPlan.features
            .split(",")
            .map((f) => f.trim())
            .filter((f) => f),
        }
      );
      Swal.fire("Updated!", "Subscription plan updated successfully.", "success");
      setShowModal(false);
      fetchPlans();
    } catch (err) {
      console.error("Update failed:", err);
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">All Subscription Plans</h2>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition"
          >
            {/* Plan Name */}
            <h3 className="text-lg font-semibold text-gray-800">
              {plan.planName}
            </h3>

            {/* Price */}
            <p className="text-2xl font-bold text-gray-900 mt-2">
              ₹{plan.price}/month
            </p>

            {/* Description */}
            <p className="text-gray-600 text-sm mt-2">{plan.description}</p>

            {/* Features */}
            <ul className="mt-4 space-y-1 text-gray-700 text-sm">
              {plan.features &&
                plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-green-600">✓</span> {feature}
                  </li>
                ))}
            </ul>

            {/* Action buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleEdit(plan)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                <Edit2 size={16} /> Edit
              </button>
              <button
                onClick={() => handleDelete(plan._id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showModal && currentPlan && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 relative">
            <h3 className="text-xl font-semibold mb-4">Edit Subscription Plan</h3>
            <form className="space-y-4" onSubmit={handleUpdate}>
              <div>
                <label className="block text-sm font-medium mb-1">Plan Name</label>
                <input
                  type="text"
                  value={currentPlan.planName}
                  onChange={(e) =>
                    setCurrentPlan({ ...currentPlan, planName: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Price (₹)</label>
                <input
                  type="number"
                  value={currentPlan.price}
                  onChange={(e) =>
                    setCurrentPlan({ ...currentPlan, price: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={currentPlan.description}
                  onChange={(e) =>
                    setCurrentPlan({ ...currentPlan, description: e.target.value })
                  }
                  required
                  rows="3"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Features (comma separated)
                </label>
                <input
                  type="text"
                  value={currentPlan.features}
                  onChange={(e) =>
                    setCurrentPlan({ ...currentPlan, features: e.target.value })
                  }
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-600 text-white py-2 rounded-md hover:bg-slate-700"
              >
                Update Plan
              </button>
            </form>
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllSubscriptions;
