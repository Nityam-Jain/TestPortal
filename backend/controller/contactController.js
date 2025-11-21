const Contact = require("../models/Contact");

// =========================
// Create Contact Query
// =========================
exports.createContact = async (req, res) => {
  try {
    const newQuery = new Contact(req.body);
    const savedQuery = await newQuery.save();

    res.status(201).json({
      success: true,
      message: "Contact query submitted successfully",
      data: savedQuery,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit contact query",
      error: error.message,
    });
  }
};

// =========================
// Get All Contact Queries
// =========================
exports.getContacts = async (req, res) => {
  try {
    const queries = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: queries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch contact queries",
      error: error.message,
    });
  }
};

// =========================
// Update Status (pending → solved or solved → pending)
// =========================
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !["pending", "solved"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const updatedQuery = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedQuery) {
      return res.status(404).json({
        success: false,
        message: "Query not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: updatedQuery,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: error.message,
    });
  }
};
