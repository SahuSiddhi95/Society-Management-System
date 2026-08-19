const mongoose = require("mongoose");

const societySchema = new mongoose.Schema(
  {
    societyName: { type: String, required: true, default: "SocietyOS" },
    logo: { type: String, default: "" },
    address: { type: String, default: "123 Main Street" },
    contactNumber: { type: String, default: "+91 0000000000" },
    contactEmail: { type: String, default: "admin@societyos.com" },
    totalWings: { type: Number, default: 4 },
    totalFloors: { type: Number, default: 10 },
    totalFlats: { type: Number, default: 200 },
    maintenanceAmount: { type: Number, default: 1500 },
    maintenanceDueDay: { type: Number, default: 5 }, // e.g., 5th of every month
    emergencyContact: { type: String, default: "100" },
    securityContact: { type: String, default: "101" },
    officeTiming: { type: String, default: "9:00 AM - 6:00 PM" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Society", societySchema);
