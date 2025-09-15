const mongoose = require("mongoose");

const reelSchema = new mongoose.Schema(
  {
    videoUrl: {
      type: String,
      required: true, // Cloud/Local path
    },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reel", reelSchema);
