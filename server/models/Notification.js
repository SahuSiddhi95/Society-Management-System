const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["notice", "complaint", "event", "payment", "maintenance", "general"],
      default: "general",
    },

    senderName: {
      type: String,
    },

    flatNo: {
      type: String,
    },

    // "read" (not "isRead") — used consistently in all controllers
    read: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Priority flag: "normal" | "important"
    priority: {
      type: String,
      enum: ["normal", "important"],
      default: "normal",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);