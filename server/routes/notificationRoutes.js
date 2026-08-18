const express = require("express");
const router = express.Router();

const {
  getNotifications,
  getUnreadNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} = require("../controllers/notificationControllers");

const { protect } = require("../middleware/authMiddleware");

// ── GET ─────────────────────────────────────────────────────────────────────
// All notifications for the logged-in user
router.get("/", protect, getNotifications);

// Unread notifications list
router.get("/unread", protect, getUnreadNotifications);

// Unread count (used by the bell badge in the Topbar)
router.get("/unread-count", protect, getUnreadCount);

// ── PUT ──────────────────────────────────────────────────────────────────────
// Mark a single notification as read
// NOTE: /read-all must come before /:id/read so Express doesn't mistake
// "read-all" as an :id param.
router.put("/read-all", protect, markAllAsRead);

// Mark one notification as read
router.put("/:id/read", protect, markAsRead);

// ── DELETE ───────────────────────────────────────────────────────────────────
// Delete ALL notifications for the logged-in user  (must be before /:id)
router.delete("/", protect, deleteAllNotifications);

// Delete a single notification
router.delete("/:id", protect, deleteNotification);

module.exports = router;