import React, { useState } from "react";

const AddSubscriptionPlan = () => {
  const [formData, setFormData] = useState({
    planName: "",
    price: "",
    credits: "",
    description: "",
    features: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // TODO: API call to save subscription plan
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">
        Add New Subscription Plan
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Plan Name */}
          <div>
            <label className="block font-semibold mb-1">Plan Name</label>
            <select
              name="planName"
              value={formData.planName}
              onChange={handleChange}
              className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
            >
              <option value="">Select a Plan</option>
              <option value="basic">Free</option>
              <option value="standard">Standard</option>
              <option value="premium">Pro</option>
            </select>
          </div>

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

          {/* Credits */}
          <div>
            <label className="block font-semibold mb-1">Credits</label>
            <input
              type="number"
              name="credits"
              placeholder="Total Credits for the Plan"
              value={formData.credits}
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
            placeholder="Short description about the plan..."
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
            placeholder="e.g. "
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
