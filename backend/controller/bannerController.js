const Banner = require("../models/Banner");
const fs = require("fs");
const path = require("path");

// Get all banners
const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch banners" });
  }
};

// Upload new banner
const createBanner = async (req, res) => {
  try {
    // console.log("📥 File received:", req.file);

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const newBanner = new Banner({ image: req.file.filename });
    await newBanner.save();
    res.status(201).json(newBanner);
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: err.message || "Failed to upload banner" });
  }
};


// Delete banner
const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ error: "Banner not found" });

    const filePath = path.join(process.cwd(), "uploads", banner.image);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: "Banner deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete banner" });
  }
};

module.exports = { getBanners, createBanner, deleteBanner };
