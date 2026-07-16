const express = require("express");
const router = express.Router();

const {
  createMaintenance,
  getAllMaintenance,
  getMyDues,
  updateMaintenance,
  deleteMaintenance,
  generateDues,
  getPaymentHistory
} = require("../controllers/maintenanceController");

const { protect } = require("../middleware/authMiddleware");

const { adminOnly } = require("../middleware/roleMiddleware");

router.post("/", protect, adminOnly, createMaintenance);

router.get("/", protect, adminOnly, getAllMaintenance);

router.get("/my-dues", protect, getMyDues);

router.put("/:id", protect, adminOnly, updateMaintenance);

router.delete("/:id", protect, adminOnly, deleteMaintenance);
router.get("/history", getPaymentHistory);
router.post("/generate-dues", protect, adminOnly, generateDues);
module.exports = router;
