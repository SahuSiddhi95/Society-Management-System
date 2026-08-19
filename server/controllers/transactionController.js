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
          const flatInfo = req.user.flatNo || req.user.flatNumber ? ` (Flat ${req.user.flatNo || req.user.flatNumber})` : "";
          await Notification.insertMany(
            admins.map((admin) => ({
              title: "Maintenance Payment Received",
              message: `${req.user.name || "Resident"}${flatInfo} paid ${maintenance.month} maintenance (₹${maintenance.amount})`,
              type: "maintenance",
              user: admin._id,
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