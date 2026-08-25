const express = require("express");
const router = express.Router();

const {
  createMaintenance,
  getAllMaintenance,
  getMyDues,
  updateMaintenance,
  deleteMaintenance,
  deleteMaintenanceByDateRange,
  generateDues,
  getPaymentHistory,
  sendReminders
} = require("../controllers/maintenanceController");

const { protect } = require("../middleware/authMiddleware");

const { adminOnly } = require("../middleware/roleMiddleware");

router.post("/", protect, adminOnly, createMaintenance);

router.get("/", protect, adminOnly, getAllMaintenance);

router.get("/my-dues", protect, getMyDues);

router.delete("/admin/delete-range", protect, adminOnly, deleteMaintenanceByDateRange);

router.put("/:id", protect, adminOnly, updateMaintenance);

router.delete("/:id", protect, adminOnly, deleteMaintenance);
router.get("/history", getPaymentHistory);
router.post("/generate-dues", protect, adminOnly, generateDues);
router.post("/send-reminders", protect, adminOnly, sendReminders);
module.exports = router;

