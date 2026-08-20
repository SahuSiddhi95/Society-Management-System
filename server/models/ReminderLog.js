const mongoose = require("mongoose");

const reminderLogSchema = new mongoose.Schema({
  maintenance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Maintenance",
    required: true,
  },
  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: String, // Stored as YYYY-MM-DD
    required: true,
  },
  channelsSent: {
    type: [String], // 'email', 'sms', 'in-app'
    default: [],
  }
}, { timestamps: true });

// Prevent multiple reminders on the same day for the same maintenance record and user
reminderLogSchema.index({ maintenance: 1, resident: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("ReminderLog", reminderLogSchema);
