const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  maintenance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Maintenance",
  },

  transactionId: String,

  amount: Number,
  category: {
    type: String,
    enum: [
      "Maintenance",
  "Event",
  "Parking",
  "Water Charges",
  "Sinking Fund",
  "Penalty",
  "Other"
    ]
  },
  method: {
    type: String,
    default: "Mock Payment",
  },

  status: {
    type: String,
    enum: ["paid", "failed"],
    default: "paid",
  },

  description: String,
  paymentProof: String,

}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);