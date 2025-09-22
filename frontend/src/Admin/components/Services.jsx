import React, { useState, useEffect } from "react";
import { Trash2, Edit2, Plus } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    highlights: "",
    image: null,
  });

  // Fetch services
  const fetchServices = async () => {
    try {
      const res = await axios.get("/api/services");
      setServices(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch services:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Add new service
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("highlights", formData.highlights);
      if (formData.image) data.append("image", formData.image, formData.name);

      const res = await axios.post("/api/services", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setServices((prev) => [...prev, res.data]);
      setFormData({ name: "", description: "", price: "", highlights: "", image: null });
      setShowAdd(false);
      Swal.fire("Success", "Service added successfully", "success");
    } catch (err) {
      console.error("Add service error:", err);
      Swal.fire("Error", "Failed to add service", "error");
    }
  };

  // Delete service
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await axios.delete(`/api/services/${id}`);
      setServices((prev) => prev.filter((s) => s._id !== id));
      Swal.fire("Deleted", "Service deleted successfully", "success");
    } catch (err) {
      console.error("Delete service error:", err);
      Swal.fire("Error", "Failed to delete service", "error");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Services</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 bg-slate-600 text-white rounded-lg flex items-center gap-2 hover:bg-slate-700 transition"
        >
          <Plus size={18} /> Add Service
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading services...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between"
            >
              {service.image && (
                <img
                  src={`/uploads/${service.image}`}
                  alt={service.name}
                  className="h-40 w-full object-cover rounded-md mb-4"
                />
              )}
              <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
              <p className="text-gray-600 mb-2">{service.description}</p>
              {service.highlights && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {service.highlights.split(",").map((h, i) => (
                    <span
                      key={i}
                      className="bg-slate-200 text-slate-800 text-sm px-2 py-1 rounded-full"
                    >
                      {h.trim()}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center mt-4">
                <span className="font-semibold">₹{service.price}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="p-2 hover:bg-red-100/80 rounded"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                  {/* You can implement edit later */}
                  <button className="p-2 hover:bg-blue-100/80 rounded">
                    <Edit2 className="w-5 h-5 text-blue-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Service Modal */}
      {showAdd && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 relative">
            <h3 className="text-xl font-semibold mb-4">Add Service</h3>
            <form className="space-y-4" onSubmit={handleAdd}>
              <input
                type="text"
                name="name"
                placeholder="Service Name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
              />
              <textarea
                name="description"
                rows="3"
                placeholder="Service Description"
                required
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
              />
              <input
                type="text"
                name="highlights"
                placeholder="Highlights (comma separated)"
                value={formData.highlights}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
              />
              <input
                type="text"
                name="price"
                placeholder="Price"
                required
                value={formData.price}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
              />
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
              />
              <button
                type="submit"
                className="w-full py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition"
              >
                Add Service
              </button>
            </form>
            <button
              onClick={() => setShowAdd(false)}
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

export default Services;
