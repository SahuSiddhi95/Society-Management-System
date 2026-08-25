    const express = require("express");
    const router = express.Router();

    const {
      payMaintenance,
      createRazorpayOrder,
      verifyRazorpayPayment,
      createAllRazorpayOrder,
      verifyAllRazorpayPayment,
      recordManualPayment,
      getMyTransactions,
      getAllTransactions,
      getTransactionStats,
      deleteTransactionsByDateRange,
    } = require("../controllers/transactionController");

    const {protect} = require("../middleware/authMiddleware");

    const {adminOnly} = require("../middleware/roleMiddleware");
    const upload = require("../middleware/upload");

    router.post("/pay", protect, payMaintenance);
    router.post("/create-order", protect, createRazorpayOrder);
    router.post("/verify-payment", protect, verifyRazorpayPayment);

    router.post("/create-all-order", protect, createAllRazorpayOrder);
    router.post("/verify-all-payment", protect, verifyAllRazorpayPayment);

    
    router.post("/manual-payment", protect, adminOnly, upload.single("proof"), recordManualPayment);

    router.get("/my-transactions", protect, getMyTransactions);

    router.get("/admin/transactions", protect, adminOnly, getAllTransactions);

    router.get("/admin/stats", protect, adminOnly, getTransactionStats);

    router.delete("/admin/delete-range", protect, adminOnly, deleteTransactionsByDateRange);

    module.exports = router;


