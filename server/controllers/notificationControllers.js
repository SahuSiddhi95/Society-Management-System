const Notification = require("../models/Notification");

// ================================
// Get All Notifications
// GET /api/notifications/
// ================================
exports.getNotifications = async (req, res) => {
  try {
    let query = { user: req.user._id };
    if (req.user.role === "admin") {
      query = {}; // Admin gets all notifications
    }

    const notifications = await Notification.find(query)
      .populate("user", "name flatNo flatNumber email phone")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================================
// Get Unread Notifications
// GET /api/notifications/unread
// ================================
exports.getUnreadNotifications = async (req, res) => {
  try {
    let query = { user: req.user._id, read: false };
    if (req.user.role === "admin") {
      query = { read: false };
    }

    const notifications = await Notification.find(query)
      .populate("user", "name flatNo flatNumber email phone")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================================
// Get Unread Count (for bell badge)
// GET /api/notifications/unread-count
// ================================
exports.getUnreadCount = async (req, res) => {
  try {
    let query = { user: req.user._id, read: false };
    if (req.user.role === "admin") {
      query = { read: false };
    }

    const count = await Notification.countDocuments(query);

    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================================
// Mark One Notification as Read
// PUT /api/notifications/:id/read
// ================================
exports.markAsRead = async (req, res) => {
  try {
    const query = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, user: req.user._id };
    const notification = await Notification.findOneAndUpdate(
      query,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================================
// Mark All as Read
// PUT /api/notifications/read-all
// ================================
exports.markAllAsRead = async (req, res) => {
  try {
    const query = req.user.role === "admin" ? { read: false } : { user: req.user._id, read: false };
    await Notification.updateMany(query, { read: true });

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================================
// Delete One Notification
// DELETE /api/notifications/:id
// ================================
exports.deleteNotification = async (req, res) => {
  try {
    const query = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, user: req.user._id };
    const notification = await Notification.findOneAndDelete(query);

    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================================
// Delete All Notifications
// DELETE /api/notifications/
// ================================
exports.deleteAllNotifications = async (req, res) => {
  try {
    const query = req.user.role === "admin" ? {} : { user: req.user._id };
    await Notification.deleteMany(query);

    res.status(200).json({
      success: true,
      message: "All notifications deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};