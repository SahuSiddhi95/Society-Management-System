// controllers/adminController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
      flatNo,
      floor,
      flatType,
    } = req.body;

    // Check existing user
    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Check duplicate flat number
    const flatExists = await User.findOne({ flatNo });

    if (flatExists) {
      return res.status(400).json({
        message: "Flat number already assigned",
      });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashed,
        phone,
      role: role || "resident",

      // Flat Details
      flatNo,
      floor,
      flatType,
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });

  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Create Admin
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const adminExists = await User.findOne({
      role: "admin",
    });

    if (adminExists) {
      return res.status(400).json({
        message: "Only one admin is allowed",
      });
    }

    // Check email
    const emailExists = await User.findOne({ email });
          
    if (emailExists) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create admin
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
    console.log(error.message)
  }
};
exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};