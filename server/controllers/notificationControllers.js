const Notification = require("../models/Notification");

// ================================
// Get All Notifications
// GET /api/notifications
// ================================

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate("user", "name flatNo")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================================
// Get Unread Notifications
// GET /api/notifications/unread
// ================================

exports.getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      read: false,
    })
      .populate("user", "name flatNo")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================================
// Mark One Notification Read
// PUT /api/notifications/:id/read
// ================================

exports.markAsRead = async (req, res) => {
  try {
    const notification =
      await Notification.findByIdAndUpdate(
        req.params.id,
        {
          read: true,
        },
        {
          new: true,
        }
      );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================================
// Mark All Read
// PUT /api/notifications/read-all
// ================================

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        read: false,
      },
      {
        read: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================================
// Delete Notification
// DELETE /api/notifications/:id
// ================================

exports.deleteNotification = async (req, res) => {
  try {
    const notification =
      await Notification.findByIdAndDelete(
        req.params.id
      );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};