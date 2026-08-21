// controllers/dashboardController.js

const User = require("../models/User");
const Maintenance = require("../models/Maintenance");

exports.getDashboardStats = async (req, res) => {
  try {
    // Residents
    const residentAggregation = await User.aggregate([
      { $match: { role: "user" } },
      { $group: { _id: null, mainUsers: { $sum: 1 }, familyMembers: { $sum: "$familyMembersCount" } } }
    ]);
    const totalResidents = residentAggregation.length > 0 ? residentAggregation[0].mainUsers + (residentAggregation[0].familyMembers || 0) : 0;

    // Flats — count distinct flatNo values assigned to residents
    const flatNoList = await User.distinct("flatNo", { role: "user" });
    const occupiedFlats = flatNoList.length;
    const Society = require("../models/Society");
    const societyDoc = await Society.findOne();
    const TOTAL_FLATS = societyDoc && societyDoc.totalFlats ? societyDoc.totalFlats : 50;
    const totalFlats = TOTAL_FLATS;
    const vacantFlats = TOTAL_FLATS > occupiedFlats ? TOTAL_FLATS - occupiedFlats : 0;

    // Maintenance Collections
    const paidMaintenance = await Maintenance.aggregate([
      { $match: { status: "Paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const maintenanceCollected = paidMaintenance.length > 0 ? paidMaintenance[0].total : 0;

    const pendingMaintenance = await Maintenance.aggregate([
      { $match: { status: "Pending" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const pendingPayments = pendingMaintenance.length > 0 ? pendingMaintenance[0].total : 0;

    const defaultersList = await Maintenance.distinct("resident", { status: "Pending" });
    const defaulters = defaultersList.length;

    // Payment History (latest 5 payments)
    const paymentHistory = await Maintenance.find({
      status: "Paid",
    })
      .populate("resident", "name flatNo")
      .sort({ updatedAt: -1 })
      .limit(5);

    res.json({
      totalResidents,
      totalFlats,
      occupiedFlats,
      vacantFlats,
      maintenanceCollected,
      pendingPayments,
      defaulters,
      paymentHistory,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};