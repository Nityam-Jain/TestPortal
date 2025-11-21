const express = require("express");
const Contact = require("../models/Contact");
const {
  createContact,
  getContacts,
  updateStatus,
} = require("../controller/contactController");

const router = express.Router();

// Create new contact query
router.post("/", createContact);

// Get all contact queries (admin)
router.get("/", getContacts);

// Update status (pending/solved)
router.patch("/:id/status", updateStatus);

// Delete contact query
router.delete("/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Query deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete query" });
  }
});

module.exports = router;
