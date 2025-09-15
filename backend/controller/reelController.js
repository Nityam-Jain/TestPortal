
const Reel = require("../models/Reel");

// 📌 Upload new reel
exports.createReel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No video uploaded" });
    }

    const newReel = new Reel({
      videoUrl: `/uploads/reels/${req.file.filename}`, // saved path
      
    });

    await newReel.save();
    res.status(201).json(newReel);  
  } catch (error) {
    res.status(500).json({ message: "Error uploading reel", error });
  }
};

// 📌 Get all reels
exports.getReels = async (req, res) => {
  try {
    const reels = await Reel.find().sort({ createdAt: -1 });
    res.json(reels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reels", error });
  }
};

// 📌 Delete reel
exports.deleteReel = async (req, res) => {
  try {
    const { id } = req.params;
    await Reel.findByIdAndDelete(id);
    res.json({ message: "Reel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting reel", error });
  }
};
