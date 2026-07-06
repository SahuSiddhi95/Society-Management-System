// models/Complaint.js

const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    title: String,

    category: {
      type: String,
      enum: ["Water", "Electric", "Lift", "Plumber", "Other"],
      required: true,
      default: "Other",
    },

    description: String,

    image: String,

    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);