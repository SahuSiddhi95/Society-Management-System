const Contact = require("../models/Contact");

// Create Contact Message
exports.createContact = async (req, res) => {
  try {
    const { name, email, societyName, message } = req.body;

    // Validation
    if (!name || !email || !societyName || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Save to DB
    const contact = await Contact.create({
      name,
      email,
      societyName,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: contact,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};