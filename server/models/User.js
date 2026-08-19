// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    // ADD THIS
    // Flat Details for Users

    flatNo: {
      type: String,

      required: true,
      unique: true,
    },
    phone: {
      type: String, required: true, unique: true
    },

    floor: {
      type: Number,
    },

    flatType: {
      type: String,
      enum: ["1BHK", "2BHK", "3BHK"],
      default: "2BHK",
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    // FORGOT PASSWORD FIELDS

    otp: {
      type: String,
    },

    otpExpire: {
      type: Date,
    },

    familyMembersCount: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    familyMembers: [
      {
        name: { type: String, required: true },
        age: { type: Number, required: true },
        relation: { type: String, required: true },
      }
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
