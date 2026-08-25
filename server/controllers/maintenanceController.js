const Maintenance = require("../models/Maintenance");
const User = require("../models/User");
const ReminderLog = require("../models/ReminderLog");
const emailService = require("../services/emailService");
const smsService = require("../services/smsService");
const notificationService = require("../services/notificationService");
const Transaction = require("../models/Transaction");
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
    const payments = await Maintenance.find({
      status: "Paid",
    })
      .populate("resident", "name flatNo email")
      .sort({ updatedAt: -1 })
      .lean();

    const maintenanceIds = payments.map(p => p._id);
    const transactions = await Transaction.find({ maintenance: { $in: maintenanceIds } }).lean();

    const populatedPayments = payments.map(p => {
      const txn = transactions.find(t => t.maintenance.toString() === p._id.toString());
      if (txn) {
        return {
          ...p,
          paymentMethod: p.paymentMethod || txn.method,
          receiptNumber: p.receiptNumber || txn.transactionId,
          paymentProof: p.paymentProof || txn.paymentProof,
          paymentDate: p.paidAt || txn.createdAt
        };
      }
      return {
        ...p,
        paymentDate: p.paidAt || p.updatedAt
      };
    });

    res.status(200).json({
      success: true,
      payments: populatedPayments,
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
    if (req.body.status === "Paid" && !req.body.paidAt) {
      req.body.paidAt = new Date();
    }
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
    const { amount, month, year, dueDate, category, description, residentId } = req.body;
    let query = { role: "user" };
    if (residentId && residentId !== "All") {
      query = { _id: residentId, role: "user" };
    }
    const residents = await User.find(query);

    const dues = [];
    let emailsSent = 0;
    let smsSent = 0;
    let inAppSent = 0;

    const generationPromises = residents.map(async (resident) => {
      const exists = await Maintenance.findOne({
        resident: resident._id,
        month,
        year,
        category
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

        // Send multi-channel notifications concurrently
        const [emailRes, smsRes, inAppRes] = await Promise.all([
          emailService.sendMaintenanceEmail(resident, due).catch(() => ({ success: false })),
          smsService.sendMaintenanceSMS(resident, due).catch(() => ({ success: false })),
          notificationService.sendInAppNotification(resident, due).catch(() => ({ success: false }))
        ]);

        return { due, emailRes, smsRes, inAppRes };
      }
      return null;
    });

    const results = await Promise.all(generationPromises);

    for (const res of results) {
      if (res) {
        dues.push(res.due);
        if (res.emailRes.success) emailsSent++;
        if (res.smsRes.success) smsSent++;
        if (res.inAppRes.success) inAppSent++;
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
    res.status(500).json({ success: false, message: err.message || "Failed to generate dues" });
  }
};

exports.sendRemindersLogic = async (adminUserId = null) => {
  const dues = await Maintenance.find({ status: { $in: ["Pending", "Overdue"] } }).populate("resident");
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  
  let emailsSent = 0;
  let smsSent = 0;
  let inAppSent = 0;
  let remindersProcessed = 0;

  for (const due of dues) {
    if (!due.resident) continue;

    // Check duplicate using ReminderLog for today
    const existingLog = await ReminderLog.findOne({
      maintenance: due._id,
      resident: due.resident._id,
      date: today
    });

    if (existingLog) {
      continue; // Skip, reminder already sent today
    }

    const channelsSent = [];

    // Send notifications
    const [emailRes, smsRes, inAppRes] = await Promise.all([
      emailService.sendMaintenanceReminderEmail(due.resident, due).catch(() => ({ success: false })),
      smsService.sendMaintenanceReminderSMS(due.resident, due).catch(() => ({ success: false })),
      notificationService.sendInAppReminderNotification(due.resident, due).catch(() => ({ success: false }))
    ]);

    if (emailRes.success) { emailsSent++; channelsSent.push("email"); }
    if (smsRes.success) { smsSent++; channelsSent.push("sms"); }
    if (inAppRes.success) { inAppSent++; channelsSent.push("in-app"); }

    // Log the reminder
    await ReminderLog.create({
      maintenance: due._id,
      resident: due.resident._id,
      date: today,
      channelsSent
    });

    remindersProcessed++;
  }

  return {
    success: true,
    message: "Reminders processed successfully",
    totalProcessed: remindersProcessed,
    emailsSent,
    smsSent,
    inAppSent
  };
};

exports.sendReminders = async (req, res) => {
  try {
    const result = await exports.sendRemindersLogic(req.user._id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in sendReminders API:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin Delete Maintenance by Date Range / Years
exports.deleteMaintenanceByDateRange = async (req, res) => {
  try {
    const { startDate, endDate, olderThanYears, status } = req.body;
    let filter = {};

    if (status && status !== "ALL") {
      filter.status = status;
    }

    if (olderThanYears) {
      const targetDate = new Date();
      targetDate.setFullYear(targetDate.getFullYear() - Number(olderThanYears));
      filter.createdAt = { $lte: targetDate };
    } else if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate + "T23:59:59.999Z");
    } else {
      return res.status(400).json({
        success: false,
        message: "Please specify a date range or older than X years option",
      });
    }

    const result = await Maintenance.deleteMany(filter);
    res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} maintenance records`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting maintenance records by range:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete maintenance records",
    });
  }
};