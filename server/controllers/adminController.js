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
      familyMembersCount,
      familyMembers,
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

      // Family Details
      familyMembersCount: familyMembersCount || 0,
      familyMembers: familyMembers || [],
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

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Check if flat is already assigned to someone else
    if (updateData.flatNo) {
      const flatExists = await User.findOne({ flatNo: updateData.flatNo, _id: { $ne: id } });
      if (flatExists) {
        return res.status(400).json({ message: "Flat number already assigned to another user" });
      }
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      delete updateData.password; // Don't update password if it's empty
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateAdminCredentials = async (req, res) => {
  try {
    const { currentPassword, newEmail, newPassword } = req.body;

    // Find admin user
    const admin = await User.findById(req.user._id);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized." });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect current password." });
    }

    const updateData = {};

    // Check if new email already exists
    if (newEmail && newEmail !== admin.email) {
      const emailExists = await User.findOne({ email: newEmail });
      if (emailExists) {
        return res.status(400).json({ success: false, message: "Email is already in use by another account." });
      }
      updateData.email = newEmail;
    }

    // Update password if provided
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedPassword;
    }

    if (Object.keys(updateData).length > 0) {
      await User.updateOne({ _id: admin._id }, { $set: updateData });
    }

    res.status(200).json({ success: true, message: "Admin credentials updated successfully. Please login again." });
  } catch (error) {
    console.error("Update admin credentials error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};