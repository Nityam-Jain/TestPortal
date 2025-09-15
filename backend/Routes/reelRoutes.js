const express = require("express");
const router = express.Router();
const reelController = require("../controller/reelController");
const upload = require("../middleware/uploads");

// Upload reel (mp4 only)
router.post("/uploads", upload.single("video"), reelController.createReel);

// Get all reels
router.get("/getReels", reelController.getReels);

// Delete reel
router.delete("/:id", reelController.deleteReel);

module.exports = router;
