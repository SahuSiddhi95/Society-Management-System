// controllers/dashboardController.js

const User = require("../models/User");
const Maintenance = require("../models/Maintenance");

exports.getDashboardStats = async (req, res) => {
  try {
    // Residents
    const totalResidents = await User.countDocuments({
      role: "user",
    });

    // Flats — count distinct flatNo values assigned to residents
    const flatNoList = await User.distinct("flatNo", { role: "user" });
    const totalFlats = flatNoList.length;

    // Payment History (latest 5 payments)
    // NOTE: enum in Maintenance model uses "Paid" (capital P) — must match exactly
    const paymentHistory = await Maintenance.find({
      status: "Paid",
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