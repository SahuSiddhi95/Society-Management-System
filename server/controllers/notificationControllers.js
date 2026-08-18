const Notification = require("../models/Notification");

// ================================
// Get All Notifications (user-scoped)
// GET /api/notifications/
// ================================
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
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
// Get Unread Notifications (user-scoped)
// GET /api/notifications/unread
// ================================
exports.getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
      read: false,
    })
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
    const count = await Notification.countDocuments({
      user: req.user._id,
      read: false,
    });

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
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
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
// Mark All as Read (user-scoped)
// PUT /api/notifications/read-all
// ================================
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true }
    );

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
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

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
// Delete All Notifications (user-scoped)
// DELETE /api/notifications/
// ================================
exports.deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user._id });

    res.status(200).json({
      success: true,
      message: "All notifications deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};