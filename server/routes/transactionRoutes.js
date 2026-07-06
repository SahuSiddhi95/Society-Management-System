const express = require("express");
const router = express.Router();

const {
  payMaintenance,
  getMyTransactions,
  getAllTransactions,
  getTransactionStats,
} = require("../controllers/transactionController");

const {protect} = require("../middleware/authMiddleware");

const {adminOnly} = require("../middleware/roleMiddleware");

router.post("/pay", protect, payMaintenance);

router.get("/my-transactions", protect, getMyTransactions);

router.get("/admin/transactions", protect, adminOnly, getAllTransactions);

router.get("/admin/stats", protect, adminOnly, getTransactionStats);

module.exports = router;
