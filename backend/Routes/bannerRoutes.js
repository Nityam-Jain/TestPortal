const express = require("express");
const multer = require("multer");
const path = require("path");
const { getBanners, createBanner, deleteBanner } = require("../controller/bannerController")
const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Routes
router.get("/", getBanners);
router.post("/", upload.single("image"), createBanner);
router.delete("/:id", deleteBanner);

module.exports = router;
