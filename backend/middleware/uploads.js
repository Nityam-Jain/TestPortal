const multer = require("multer");
const path = require("path");

// Storage (local uploads/reels folder)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/reels");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter (only mp4)
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".mp4") {
    cb(null, true);
  } else {
    cb(new Error("Only mp4 videos are allowed!"), false);
  }
};

// ✅ Add size limit (3.5 MB)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3.5 * 1024 * 1024 }, // 3.5 MB in bytes
});

module.exports = upload;
