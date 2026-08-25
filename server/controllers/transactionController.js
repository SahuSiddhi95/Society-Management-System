const crypto = require("crypto");
const razorpayInstance = require("../config/razorpay");
const Transaction = require("../models/Transaction");
const Maintenance = require("../models/Maintenance");
const User = require("../models/User");
const Notification = require("../models/Notification");

// Create Razorpay Order
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { maintenanceId } = req.body;
    const maintenance = await Maintenance.findById(maintenanceId);

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: "Maintenance record not found",
      });
    }

    if (maintenance.status === "Paid") {
      return res.status(400).json({
        success: false,
        message: "This maintenance bill is already paid",
      });
    }

    // Razorpay amount in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(maintenance.amount * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${maintenance._id.toString().slice(-10)}_${Date.now()}`,
      notes: {
        maintenanceId: maintenance._id.toString(),
        userId: req.user._id.toString(),
        month: maintenance.month || "",
      },
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_TTxYjBQ1SKwckh",
      maintenance,
    });
  } catch (error) {

    console.error("Error creating Razorpay order:", error);
    const rzpDesc = error.error?.description || error.description || error.message;
    const isAuthErr = error.statusCode === 401 || (rzpDesc && rzpDesc.includes("Authentication failed"));
    const userMessage = isAuthErr
      ? "Razorpay API Authentication failed (401). Please verify your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server/.env or generate a new Key from Razorpay Dashboard (Settings -> API Keys)."
      : rzpDesc || "Failed to create Razorpay order";

    res.status(400).json({
      success: false,
      message: userMessage,
    });
  }
};


// Verify Razorpay Payment Signature
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      maintenanceId,
    } = req.body;

    console.log(" Verifying single Razorpay payment:", { razorpay_order_id, razorpay_payment_id, maintenanceId });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing Razorpay payment parameters",
      });
    }

    const secret = (process.env.RAZORPAY_KEY_SECRET || "fD3z2BfS0lDhUiMrBo06pbq3").trim();

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      console.error(" Signature verification failed! Expected:", expectedSignature, "Got:", razorpay_signature);
      return res.status(400).json({
        success: false,
        message: "Payment verification failed! Invalid signature.",
      });
    }

    const maintenance = await Maintenance.findById(maintenanceId);
    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: "Maintenance record not found",
      });
    }

    maintenance.status = "Paid";
    maintenance.paidAt = new Date();
    maintenance.paymentMethod = "Razorpay";
    maintenance.receiptNumber = razorpay_payment_id;
    await maintenance.save();

    const transaction = await Transaction.create({
      user: req.user._id,
      maintenance: maintenance._id,
      amount: maintenance.amount,
      transactionId: razorpay_payment_id,
      status: "paid",
      method: "Razorpay",
      description: `${maintenance.month} Maintenance`,
    });

    // Notify Admins
    const admins = await User.find({ role: "admin" });
    if (admins.length > 0) {
      const residentName = req.user.name || "Resident";
      const residentFlat = req.user.flatNo || req.user.flatNumber || "";
      const flatInfo = residentFlat ? ` (Flat ${residentFlat})` : "";

      await Notification.insertMany(
        admins.map((admin) => ({
          title: "Maintenance Payment Received (Razorpay)",
          message: `${residentName}${flatInfo} paid ${maintenance.month} maintenance (₹${maintenance.amount}) via Razorpay. Txn ID: ${razorpay_payment_id}`,
          type: "maintenance",
          user: admin._id,
          senderName: residentName,
          flatNo: residentFlat,
        }))
      );
    }

    // Notify Resident
    await Notification.create({
      title: "Payment Successful",
      message: `Your payment of ₹${maintenance.amount} for ${maintenance.month} maintenance was successful via Razorpay. Payment ID: ${razorpay_payment_id}`,
      type: "maintenance",
      user: req.user._id,
      senderName: "System",
      flatNo: req.user.flatNo || "",
    });

    console.log(" Single payment verified successfully:", razorpay_payment_id);
    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      transaction,
    });
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Payment verification failed",
    });
  }
};


exports.payMaintenance = exports.createRazorpayOrder;

    exports.recordManualPayment = async (req, res) => {
      try {
        const { maintenanceId, method, referenceNo, amount } = req.body;

        const maintenance = await Maintenance.findById(maintenanceId).populate("resident");
        if (!maintenance) {
          return res.status(404).json({ success: false, message: "Maintenance not found" });
        }

        if (maintenance.status === "Paid") {
          return res.status(400).json({ success: false, message: "Maintenance is already paid" });
        }

        const paidAmount = amount ? Number(amount) : maintenance.amount;
        const finalReceiptNo = referenceNo || `CASH_${Date.now().toString().slice(-6)}`;

        maintenance.status = "Paid";
        maintenance.paidAt = new Date();
        maintenance.paymentMethod = method || "Cash";
        maintenance.receiptNumber = finalReceiptNo;
        if (req.file) {
          maintenance.paymentProof = req.file.path;
        }
        await maintenance.save();

        const transaction = await Transaction.create({
          user: maintenance.resident._id,
          maintenance: maintenance._id,
          amount: paidAmount,
          transactionId: finalReceiptNo,
          status: "paid",
          method: method || "Cash",
          description: `${method || "Cash"} Payment - ${maintenance.month} Maintenance`,
          paymentProof: req.file ? req.file.path : undefined
        });

        // Notify the user that admin has recorded their offline/cash payment
        await Notification.create({
          title: `Offline ${method || "Cash"} Payment Received`,
          message: `Admin has recorded your offline ${method || "Cash"} payment of ₹${paidAmount} for ${maintenance.month} maintenance. Receipt No: ${finalReceiptNo}`,
          type: "maintenance",
          user: maintenance.resident._id,
          senderName: "Admin",
          flatNo: maintenance.resident.flatNo,
        });

        res.status(200).json({
          success: true,
          message: `${method || "Cash"} payment recorded successfully!`,
          transaction
        });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    };


    exports.getMyTransactions = async (req, res) => {
      try {
        const transactions =
          await Transaction.find({
            user: req.user.id,
          }).sort({ createdAt: -1 });

        res.status(200).json(transactions);
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    };

    exports.getAllTransactions = async (req, res) => {
      try {
        const transactions =
          await Transaction.find()
            .populate(
              "user",
              "name email flatNo"
            )
            .sort({ createdAt: -1 });

        res.status(200).json(transactions);
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    };

    exports.getTransactionStats = async (
      req,
      res
    ) => {
      try {
        const transactions =
          await Transaction.find({
            status: "paid",
          });

        const totalRevenue =
          transactions.reduce(
            (sum, t) => sum + t.amount,
            0
          );

        res.status(200).json({
          totalTransactions:
            transactions.length,
          totalRevenue,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    };

// Create Razorpay Order for ALL pending dues (Bulk Payment)
exports.createAllRazorpayOrder = async (req, res) => {
  try {
    const { maintenanceIds } = req.body;
    let query = { resident: req.user._id, status: { $ne: "Paid" } };

    if (Array.isArray(maintenanceIds) && maintenanceIds.length > 0) {
      query._id = { $in: maintenanceIds };
    }

    const pendingDues = await Maintenance.find(query);

    if (!pendingDues || pendingDues.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No pending maintenance dues found to pay",
      });
    }

    const totalAmount = pendingDues.reduce((sum, d) => sum + (d.amount || 0), 0);
    const amountInPaise = Math.round(totalAmount * 100);

    const idsList = pendingDues.map((d) => d._id.toString());
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_all_${Date.now().toString().slice(-8)}`,
      notes: {
        userId: req.user._id.toString(),
        duesCount: pendingDues.length.toString(),
        maintenanceIds: idsList.join(","),
      },
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_TTxYjBQ1SKwckh",
      maintenanceIds: idsList,
      totalAmount,
      duesCount: pendingDues.length,
    });
  } catch (error) {
    console.error("Error creating Bulk Razorpay order:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create bulk Razorpay order",
    });
  }
};

// Verify Razorpay Bulk Payment Signature
exports.verifyAllRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      maintenanceIds,
    } = req.body;

    console.log(" Verifying Bulk Razorpay payment:", { razorpay_order_id, razorpay_payment_id, count: maintenanceIds?.length });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing Razorpay payment parameters",
      });
    }

    const secret = (process.env.RAZORPAY_KEY_SECRET || "fD3z2BfS0lDhUiMrBo06pbq3").trim();
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error(" Bulk signature verification failed! Expected:", expectedSignature, "Got:", razorpay_signature);
      return res.status(400).json({
        success: false,
        message: "Payment verification failed! Invalid signature.",
      });
    }


    let ids = maintenanceIds;
    if (!Array.isArray(ids) || ids.length === 0) {
      const pendingDues = await Maintenance.find({ resident: req.user._id, status: { $ne: "Paid" } });
      ids = pendingDues.map((d) => d._id.toString());
    }

    // Update all dues to Paid
    const now = new Date();
    await Maintenance.updateMany(
      { _id: { $in: ids } },
      {
        $set: {
          status: "Paid",
          paidAt: now,
          paymentMethod: "Razorpay",
          receiptNumber: razorpay_payment_id,
        },
      }
    );

    const paidDues = await Maintenance.find({ _id: { $in: ids } });
    const totalAmount = paidDues.reduce((sum, d) => sum + (d.amount || 0), 0);

    const transaction = await Transaction.create({
      user: req.user._id,
      amount: totalAmount,
      transactionId: razorpay_payment_id,
      status: "paid",
      method: "Razorpay",
      description: `Bulk Payment - ${paidDues.length} Months Maintenance`,
    });

    // Notify Admins
    const admins = await User.find({ role: "admin" });
    if (admins.length > 0) {
      const residentName = req.user.name || "Resident";
      const residentFlat = req.user.flatNo || req.user.flatNumber || "";
      const flatInfo = residentFlat ? ` (Flat ${residentFlat})` : "";

      await Notification.insertMany(
        admins.map((admin) => ({
          title: "Bulk Maintenance Payment Received (Razorpay)",
          message: `${residentName}${flatInfo} paid total dues worth ₹${totalAmount} (${paidDues.length} bills) via Razorpay. Txn ID: ${razorpay_payment_id}`,
          type: "maintenance",
          user: admin._id,
          senderName: residentName,
          flatNo: residentFlat,
        }))
      );
    }

    // Notify Resident
    await Notification.create({
      title: "All Dues Paid Successfully",
      message: `Your total payment of ₹${totalAmount} for ${paidDues.length} pending maintenance bills was successful via Razorpay. Payment ID: ${razorpay_payment_id}`,
      type: "maintenance",
      user: req.user._id,
      senderName: "System",
      flatNo: req.user.flatNo || "",
    });

    res.status(200).json({
      success: true,
      message: "All dues paid & verified successfully",
      transaction,
    });
  } catch (error) {
    console.error("Error verifying Bulk Razorpay payment:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Bulk payment verification failed",
    });
  }
};

// Admin Delete Transactions by Date Range / Years
exports.deleteTransactionsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate, olderThanYears } = req.body;
    let filter = {};

    if (olderThanYears) {
      const targetDate = new Date();
      targetDate.setFullYear(targetDate.getFullYear() - Number(olderThanYears));
      filter.createdAt = { $lte: targetDate };
    } else if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate + "T23:59:59.999Z");
    } else {
      return res.status(400).json({
        success: false,
        message: "Please specify a date range or older than X years option",
      });
    }

    const result = await Transaction.deleteMany(filter);
    res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} transaction records`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting transactions by date range:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete transaction records",
    });
  }
};