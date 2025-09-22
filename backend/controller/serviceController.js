const Service = require("../models/Service");
const fs = require("fs");
const path = require("path");

// Get all services
const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch services" });
  }
};

// Create new service
const createService = async (req, res) => {
  try {
    const { name, description, price, highlights } = req.body;
    let imageFile = req.file ? req.file.filename : null;

    const service = new Service({
      name,
      description,
      price,
      highlights,
      image: imageFile,
    });

    await service.save();
    res.status(201).json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create service" });
  }
};

// Update service
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, highlights } = req.body;
    const service = await Service.findById(id);
    if (!service) return res.status(404).json({ error: "Service not found" });

    // Delete old image if new one uploaded
    if (req.file && service.image) {
      const oldPath = path.join(process.cwd(), "uploads", service.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      service.image = req.file.filename;
    }

    service.name = name;
    service.description = description;
    service.price = price;
    service.highlights = highlights;

    await service.save();
    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update service" });
  }
};

// Delete service
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);
    if (!service) return res.status(404).json({ error: "Service not found" });

    // Delete image file
    if (service.image) {
      const filePath = path.join(process.cwd(), "uploads", service.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await Service.findByIdAndDelete(id);
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete service" });
  }
};

module.exports = {
  getServices,
  createService,
  updateService,
  deleteService,
};
