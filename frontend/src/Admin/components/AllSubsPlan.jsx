import React, { useEffect, useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

const AllSubscriptions = () => {
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);

  // Fetch subscription plans
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/subscriptions"); // adjust API URL
      setPlans(res.data);
    } catch (err) {
      console.error("Error fetching plans:", err);
    }
  };

  // Delete plan
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

  // Edit plan → open modal with prefilled data
  const handleEdit = (plan) => {
    setCurrentPlan({
      ...plan,
      features: plan.features ? plan.features.join(", ") : "",
    });
    setShowModal(true);
  };

  // Update plan API
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

  // Capitalize name
  const formatName = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  // Format description → 4–5 words per line
  const formatDescription = (text) => {
    if (!text) return "";
    const words = text.split(" ");
    const lines = [];
    for (let i = 0; i < words.length; i += 5) {
      lines.push(words.slice(i, i + 5).join(" "));
    }
    return lines;
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">All Subscription Plans</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="bg-gray-300 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Price (₹)</th>
              <th className="p-3">Description</th>
              <th className="p-3">Features</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan, index) => (
              <tr key={index} className="bg-white shadow-sm rounded-lg">
                <td className="p-3">{formatName(plan.planName)}</td>
                <td className="p-3">{plan.price}</td>
                <td className="p-3">
                  {formatDescription(plan.description).map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </td>
                <td className="p-3">
                  <ul className="list-disc pl-5">
                    {plan.features &&
                      plan.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                  </ul>
                </td>
                <td className="p-3 flex gap-2">
                  {/* Edit button */}
                  <button
                    onClick={() => handleEdit(plan)}
                    className="flex items-center gap-1 px-3 py-1.5 p-3 hover:bg-blue-100/80 rounded"
                  >
                    <Edit2  className="w-5 h-5 text-blue-600" size={16} /> 
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(plan._id)}
                    className="flex items-center gap-1 px-3 py-1.5 p-3 hover:bg-red-100/80 rounded"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" size={16} /> 
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                <label className="block text-sm font-medium mb-1">Features (comma separated)</label>
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
