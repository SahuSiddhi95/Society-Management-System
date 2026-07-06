const express = require("express");
const router = express.Router();

const {
  getNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notificationControllers");

const { protect } = require("../middleware/authMiddleware");


// Get all notifications of logged-in user
router.get("/", protect, getNotifications);
router.post("/", async (req, res) => {
  const Notification = require("../models/Notification");

  const notification = await Notification.create(req.body);

  res.json(notification);
});
// Get unread notifications
router.get("/unread", protect, getUnreadNotifications);

// Mark a notification as read
router.put("/:id/read", protect, markAsRead);

// Mark all notifications as read
router.put("/read-all", protect, markAllAsRead);

// Delete a notification
router.delete("/:id", protect, deleteNotification);

module.exports = router;