    const express = require("express");
    const router = express.Router();

    const {
      payMaintenance,
      recordManualPayment,
      getMyTransactions,
      getAllTransactions,
      getTransactionStats,
    } = require("../controllers/transactionController");

    const {protect} = require("../middleware/authMiddleware");

    const {adminOnly} = require("../middleware/roleMiddleware");
    const upload = require("../middleware/upload");

    router.post("/pay", protect, payMaintenance);
    
    router.post("/manual-payment", protect, adminOnly, upload.single("proof"), recordManualPayment);

    router.get("/my-transactions", protect, getMyTransactions);

    router.get("/admin/transactions", protect, adminOnly, getAllTransactions);

    router.get("/admin/stats", protect, adminOnly, getTransactionStats);

    module.exports = router;  
