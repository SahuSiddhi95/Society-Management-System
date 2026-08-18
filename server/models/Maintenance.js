const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema({
  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  month: String,
  year: Number,
  amount: Number,
  dueDate: Date,

  status: {
    type: String,
    enum: ["Pending", "Paid", "Overdue"],
    default: "Pending",
  },

  paidAt: Date,

  category: {
    type: String,
    default: "Maintenance",
  },
  
  description: String,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
}, { timestamps: true });

module.exports = mongoose.model("Maintenance", maintenanceSchema);