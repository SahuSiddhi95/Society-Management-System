// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../config/sendEmail");

// Admin Login API
// Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access only",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        message: "Wrong password",
      });
    }

    res.status(200).json({
      _id: user._id,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Resident Login API
// User Login
exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email",
      });
    }

    // Block admin from resident panel
    if (user.role === "admin") {
      return res.status(403).json({
        message: "Please use Admin Login",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        message: "Wrong password",
      });
    }

    res.status(200).json({
      _id: user._id,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// USER DETAILS
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp = otp;

  user.otpExpire = Date.now() + 10 * 60 * 1000;

  await user.save();

  // Send OTP Email
  await sendEmail(
    user.email,

    "Password Reset OTP",

    `Your OTP is:
     ${otp}`,
  );

  res.json({
    message: "OTP sent to email",
  });
};

// VERIFY OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // FIND USER
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // CHECK OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // CHECK EXPIRY
    if (user.otpExpire < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    res.json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// RESET PASSWORD API

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    // CHECK USER WITH OTP
    const user = await User.findOne({
      email,
      otp,
      otpExpire: {
        $gt: Date.now(),
      },
    });

    // INVALID OTP
    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    // HASH NEW PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // UPDATE PASSWORD
    user.password = hashedPassword;

    // CLEAR OTP
    user.otp = undefined;

    user.otpExpire = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// RESET OTP / RESEND OTP API

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // FIND USER
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // GENERATE NEW OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // SAVE OTP
    user.otp = otp;

    user.otpExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // SEND EMAIL
    await sendEmail(
      user.email,

      "Resend OTP",

      `
Your new OTP is:

${otp}

This OTP is valid for 10 minutes.
      `,
    );

    res.status(200).json({
      message: "OTP resent successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// controllers/authController.js

exports.logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};