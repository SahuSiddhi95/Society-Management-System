// controllers/dashboardController.js

const User = require("../models/User");
const Maintenance = require("../models/Maintenance");

exports.getDashboardStats = async (req, res) => {
  try {
    // Residents
    const totalResidents = await User.countDocuments({
      role: "user",
    });

    // Flats
    const totalFlats = await User.countDocuments({
      role: "user",
    });

    // Payment History (latest 5 payments)
    const paymentHistory = await Maintenance.find({
      status: "paid",
    })
      .populate("resident", "name flatNo")
      .sort({ updatedAt: -1 })
      .limit(5);

    res.json({
      totalResidents,
      totalFlats,
      paymentHistory,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};