const Contact = require("../models/Contact");

// Create a new contact query
const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();

    res.status(201).json({ message: "Message sent successfully", data: newContact });
  } catch (err) {
    console.error("Contact create error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// Get all contact queries (for admin)
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

module.exports = { createContact, getContacts };
