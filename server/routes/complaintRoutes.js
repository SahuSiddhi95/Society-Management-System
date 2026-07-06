// routes/complaintRoutes.js
const express = require("express");
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  updateComplaintStatus,
  getComplaintsByCategory,
  getComplaintStats,
} = require("../controllers/complaintController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

// ---------------------------------------------------------------------------
// USER routes
// ---------------------------------------------------------------------------
router.post("/", protect, upload.single("image"), createComplaint);
router.get("/my", protect, getMyComplaints);

// ---------------------------------------------------------------------------
// ADMIN routes
// NOTE: specific paths (/stats, /category/:category) must be registered
// before the generic "/:id" route, or Express will treat "stats"/"category"
// as an :id value.
// ---------------------------------------------------------------------------
router.get("/stats", protect, adminOnly, getComplaintStats);
router.get("/category/:category", protect, adminOnly, getComplaintsByCategory);
router.get("/", protect, adminOnly, getAllComplaints);
router.get("/:id", protect, adminOnly, getComplaintById);

router.put("/:id/status", protect, adminOnly, updateComplaintStatus);
router.put("/:id", protect, adminOnly, updateComplaint);
router.delete("/:id", protect, adminOnly, deleteComplaint);

module.exports = router;