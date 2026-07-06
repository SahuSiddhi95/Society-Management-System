// controllers/noticeController.js
const User = require("../models/User");
const Notice = require("../models/Notice");
const Notification = require("../models/Notification")
// CREATE NOTICE (ADMIN)
exports.createNotice = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const notice = await Notice.create({
      title,
      description,
      category,
      createdBy: req.user._id,
    });
    // Get all residents
    const users = await User.find({ role: "user" });

    // Create notification for every resident
    const notifications = users.map((user) => ({
      title: "📢 New Notice",
      message: `${title} has been published.`,
      type: "notice",
      recipient: user._id,
      read: false,
    }));

    await Notification.insertMany(notifications);
    res.status(201).json({
      success: true,
      message: "Notice created successfully",
      data: notice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL NOTICES (USER + ADMIN)
exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notices.length,
      data: notices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/adminNotic/category/:category

exports.getNoticeByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const notices = await Notice.find({
      category,
    }).sort({ createdAt: -1 });

    res.status(200).json(notices);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE NOTICE (ADMIN)
exports.updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notice updated successfully",
      data: notice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE NOTICE (ADMIN)
exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notice deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
