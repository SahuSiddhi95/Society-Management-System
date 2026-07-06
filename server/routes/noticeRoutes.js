const express = require("express");

const router = express.Router();

const {
  createNotice,
  getAllNotices,
  deleteNotice,
  updateNotice,
  getNoticeByCategory
} = require("../controllers/noticeController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");
// Admin Create Notice
router.post("/", protect, adminOnly, createNotice);

// Get All Notices
router.get("/", protect, getAllNotices);

// Delete Notice
router.delete("/:id", protect, adminOnly, deleteNotice);

// Update Notice
router.put("/:id", protect, adminOnly, updateNotice);
router.get("/category/:category", getNoticeByCategory);

module.exports = router;
