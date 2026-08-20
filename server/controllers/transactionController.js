    const Transaction = require("../models/Transaction");
    const Maintenance = require("../models/Maintenance");
    const User = require("../models/User");
    const Notification = require("../models/Notification");

    exports.payMaintenance = async (req, res) => {
      try {
        const { maintenanceId } = req.body;
        
        const maintenance =
          await Maintenance.findById(maintenanceId);

        if (!maintenance) {
          return res.status(404).json({
            success: false,
            message: "Maintenance not found",
          });
        }

        maintenance.status = "Paid";
        maintenance.paidAt = new Date();

        await maintenance.save();

        const transaction =
          await Transaction.create({
            user: req.user._id,
            maintenance: maintenance._id,
            amount: maintenance.amount,
            transactionId:
              "TXN" + Date.now(),
            status: "paid",
            method: "Mock Payment",
            description:
              `${maintenance.month} Maintenance`,
          });

        const admins = await User.find({ role: "admin" });
        if (admins.length > 0) {
          const residentName = req.user.name || "Resident";
          const residentFlat = req.user.flatNo || req.user.flatNumber || "";
          const flatInfo = residentFlat ? ` (Flat ${residentFlat})` : "";
          
          await Notification.insertMany(
            admins.map((admin) => ({
              title: "Maintenance Payment Received",
              message: `${residentName}${flatInfo} paid ${maintenance.month} maintenance (₹${maintenance.amount})`,
              type: "maintenance",
              user: admin._id,
              senderName: residentName,
              flatNo: residentFlat,
            }))
          );
        }

        res.status(200).json({
          success: true,
          transaction,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    };

    exports.recordManualPayment = async (req, res) => {
      try {
        const { maintenanceId, method, referenceNo } = req.body;

        const maintenance = await Maintenance.findById(maintenanceId).populate("resident");
        if (!maintenance) {
          return res.status(404).json({ success: false, message: "Maintenance not found" });
        }

        if (maintenance.status === "Paid") {
          return res.status(400).json({ success: false, message: "Maintenance is already paid" });
        }

        maintenance.status = "Paid";
        maintenance.paidAt = new Date();
        maintenance.paymentMethod = method || "Cash";
        maintenance.receiptNumber = referenceNo;
        if (req.file) {
          maintenance.paymentProof = req.file.path;
        }
        await maintenance.save();

        const transaction = await Transaction.create({
          user: maintenance.resident._id,
          maintenance: maintenance._id,
          amount: maintenance.amount,
          transactionId: referenceNo || ("MANUAL_" + Date.now()),
          status: "paid",
          method: method || "Cash",
          description: `Manual Payment - ${maintenance.month} Maintenance`,
          paymentProof: req.file ? req.file.path : undefined
        });

        // Notify the user that admin has recorded their payment
        const residentName = maintenance.resident.name || "Resident";
        await Notification.create({
          title: "Payment Recorded",
          message: `Your payment of ₹${maintenance.amount} for ${maintenance.month} maintenance has been recorded by the admin.`,
          type: "maintenance",
          user: maintenance.resident._id,
          senderName: "Admin",
          flatNo: maintenance.resident.flatNo,
        });

        res.status(200).json({ success: true, transaction });
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