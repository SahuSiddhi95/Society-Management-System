const Maintenance = require("../models/Maintenance");

exports.createMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.create(req.body);

    res.status(201).json({
      success: true,
      maintenance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.find()
      .populate("user", "name email flatNo");

    res.status(200).json(maintenance);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyDues = async (req, res) => {
  try {
    const dues = await Maintenance.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(dues);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(maintenance);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteMaintenance = async (req, res) => {
  try {
    await Maintenance.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Maintenance deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.generateDues = async (req, res) => {
    try {

        const { amount, month, year, dueDate } = req.body;

        const residents = await User.find({ role: "user" });

        const dues = [];

        for (const resident of residents) {

            const exists = await Maintenance.findOne({
                resident: resident._id,
                month,
                year
            });

            if (!exists) {

                const due = await Maintenance.create({
                    resident: resident._id,
                    amount,
                    month,
                    year,
                    dueDate,
                    createdBy: req.user._id
                });

                dues.push(due);
            }
        }

        res.json({
            success: true,
            message: "Maintenance generated successfully",
            total: dues.length
        });

    } catch (err) {
        res.status(500).json(err);
    }
};