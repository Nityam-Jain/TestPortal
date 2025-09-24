import React, { useState } from "react";
import axios from "axios";

const AddSubscriptionPlan = () => {
  const [formData, setFormData] = useState({
    planName: "",
    customPlanName: "",
    price: "",
    description: "",
    features: "",
  });

  const [isCustom, setIsCustom] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePlanChange = (e) => {
    const value = e.target.value;
    if (value === "custom") {
      setIsCustom(true);
      setFormData({ ...formData, planName: "", customPlanName: "" });
    } else {
      setIsCustom(false);
      setFormData({ ...formData, planName: value, customPlanName: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      planName: isCustom ? formData.customPlanName : formData.planName,
      price: formData.price,
      description: formData.description,
      features: formData.features.split(",").map((f) => f.trim()),
    };

    try {
      await axios.post("http://localhost:5000/api/subscriptions", payload);
      alert("Plan added successfully!");
      setFormData({
        planName: "",
        customPlanName: "",
        price: "",
        description: "",
        features: "",
      });
      setIsCustom(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add plan");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">
        Add Subscription Plan
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Plan Name */}
          <div>
            <label className="block font-semibold mb-1">Plan Name</label>
            <select
              name="planName"
              value={isCustom ? "custom" : formData.planName}
              onChange={handlePlanChange}
              className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
            >
              <option value="">Select a Plan</option>
              <option value="Free">Free</option>
              <option value="Standard">Standard</option>
              <option value="Pro">Pro</option>
              <option value="custom">Other (Custom)</option>
            </select>
          </div>

          {/* Custom Plan Input */}
          {isCustom && (
            <div>
              <label className="block font-semibold mb-1">Custom Plan Name</label>
              <input
                type="text"
                name="customPlanName"
                placeholder="Enter custom plan name"
                value={formData.customPlanName}
                onChange={handleChange}
                className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
              />
            </div>
          )}

          {/* Price */}
          <div>
            <label className="block font-semibold mb-1">Price (₹)</label>
            <input
              type="number"
              name="price"
              placeholder="Enter Price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            name="description"
            placeholder="Short description about the Subscription Plan..."
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
          ></textarea>
        </div>

        {/* Features */}
        <div>
          <label className="block font-semibold mb-1">
            Features <span className="text-red-500">(comma separated)</span>
          </label>
          <textarea
            name="features"
            placeholder="e.g. Unlimited mock tests, Detailed analytics"
            value={formData.features}
            onChange={handleChange}
            rows="2"
            className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
          ></textarea>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
          >
            Save Plan
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSubscriptionPlan;
