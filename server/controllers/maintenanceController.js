const Maintenance = require("../models/Maintenance");
const User = require("../models/User");
const emailService = require("../services/emailService");
const smsService = require("../services/smsService");
const notificationService = require("../services/notificationService");
exports.createMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.create(req.body);

    res.status(201).json({
      success: true,
      maintenance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.find()
      .populate("resident", "name email flatNo");

    res.status(200).json(maintenance);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    // NOTE: enum in Maintenance model uses "Paid" (capital P) — must match exactly
    const payments = await Maintenance.find({
      status: "Paid",
    })
      .populate("resident", "name flatNo email")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyDues = async (req, res) => {
  try {
    const dues = await Maintenance.find({
      resident: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(dues);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(maintenance);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteMaintenance = async (req, res) => {
  try {
    await Maintenance.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Maintenance deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.generateDues = async (req, res) => {
  try {
    const { amount, month, year, dueDate, category, description } = req.body;
    const residents = await User.find({ role: "user" });

    const dues = [];
    let emailsSent = 0;
    let smsSent = 0;
    let inAppSent = 0;

    for (const resident of residents) {
      const exists = await Maintenance.findOne({
        resident: resident._id,
        month,
        year
      });

      if (!exists) {
        const due = await Maintenance.create({
          resident: resident._id,
          amount,
          month,
          year,
          dueDate,
          category,
          description,
          createdBy: req.user._id
        });

        dues.push(due);

        // Send multi-channel notifications (don't fail generation if these throw)
        const [emailRes, smsRes, inAppRes] = await Promise.all([
          emailService.sendMaintenanceEmail(resident, due).catch(() => ({ success: false })),
          smsService.sendMaintenanceSMS(resident, due).catch(() => ({ success: false })),
          notificationService.sendInAppNotification(resident, due).catch(() => ({ success: false }))
        ]);

        if (emailRes.success) emailsSent++;
        if (smsRes.success) smsSent++;
        if (inAppRes.success) inAppSent++;
      }
    }

    res.json({
      success: true,
      message: "Maintenance generated successfully",
      total: dues.length,
      emailsSent,
      smsSent,
      inAppSent
    });

  } catch (err) {
    res.status(500).json(err);
  }
};