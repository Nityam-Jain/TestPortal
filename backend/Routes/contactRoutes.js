const express = require("express");
const { createContact, getContacts } = require("../controller/contactController");

const router = express.Router();

// Create new contact query
router.post("/", createContact);

// Get all contact queries (for admin panel)
router.get("/", getContacts);

// DELETE route in contactRoutes.js
router.delete("/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Query deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete query" });
  }
});

module.exports = router;
