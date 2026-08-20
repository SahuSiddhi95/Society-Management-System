// controllers/complaintController.js
const Complaint = require("../models/Complaint");
const Notification = require("../models/Notification");
const User = require("../models/User");
const VALID_STATUSES = ["pending", "resolved"];

// ---------------------------------------------------------------------------
// USER
// ---------------------------------------------------------------------------

exports.createComplaint = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const complaint = await Complaint.create({
      user: req.user._id,
      title,
      description,
      image: req.file ? req.file.path : "",
      category,
    });
    const admins = await User.find({ role: "admin" });

    const residentName = req.user.name || "Resident";
    const residentFlat = req.user.flatNo || req.user.flatNumber || "";
    const flatInfo = residentFlat ? ` (Flat ${residentFlat})` : "";
    
    await Notification.insertMany(
      admins.map((admin) => ({
        title: `New Complaint: ${title}`,
        message: `${residentName}${flatInfo} raised a complaint: "${title}"`,
        type: "complaint",
        user: admin._id,
        senderName: residentName,
        flatNo: residentFlat,
      })),
    );

    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------------------------------------------------------------------
// ADMIN
// ---------------------------------------------------------------------------

// GET /api/complaints?search=&category=&status=&page=&limit=
// Returns { complaints, total, page, pages } for the admin table + pagination.
exports.getAllComplaints = async (req, res) => {
  try {
    const {
      search = "",
      category = "",
      status = "",
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;

    // NOTE: search spans the Complaint and the populated User (name / flatNumber),
    // which live in different collections, so we filter in memory after populate.
    // Fine for typical society-scale data; swap to an aggregation $lookup if the
    // dataset grows large enough that this becomes a bottleneck.
    let complaints = await Complaint.find(query)
      .populate("user", "name email flatNo phone floor flatType")
      .sort({ createdAt: -1 });

    if (search) {
      const term = search.toLowerCase();
      complaints = complaints.filter(
        (c) =>
          c.title?.toLowerCase().includes(term) ||
          c.user?.name?.toLowerCase().includes(term) ||
          c.user?.flatNumber?.toLowerCase().includes(term),
      );
    }

    const total = complaints.length;
    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.max(Number(limit) || 10, 1);
    const start = (pageNum - 1) * limitNum;
    const paginated = complaints.slice(start, start + limitNum);

    res.json({
      complaints: paginated,
      total,
      page: pageNum,
      pages: Math.max(Math.ceil(total / limitNum), 1),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/complaints/:id
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      "user",
      "name email flatNo phone floor flatType",
    );
    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/complaints/:id  (full edit — title/description/category/status)
exports.updateComplaint = async (req, res) => {
  try {
    const { title, description, category, status } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });

    if (title !== undefined) complaint.title = title;
    if (description !== undefined) complaint.description = description;
    if (category !== undefined) complaint.category = category;
    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        return res
          .status(400)
          .json({ message: "Status must be 'pending' or 'resolved'" });
      }
      complaint.status = status;
    }

    await complaint.save();

    await Notification.create({
      title: "✅ Complaint Updated",
      message: `Your complaint "${complaint.title}" has been updated by the admin. Status: ${complaint.status}.`,
      type: "complaint",
      user: complaint.user,
      read: false,
    });

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/complaints/:id
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });

    await complaint.deleteOne();
    res.json({ message: "Complaint deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/complaints/:id/status   body: { status: "pending" | "resolved" }
// Replaces the old hardcoded resolveComplaint with a toggle in either direction.
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status)) {
      return res
        .status(400)
        .json({ message: "Status must be 'pending' or 'resolved'" });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });

    complaint.status = status;
    await complaint.save();

    await Notification.create({
      title: "✅ Complaint Status Updated",
      message: `Your complaint "${complaint.title}" is now marked as ${status}.`,
      type: "complaint",
      user: complaint.user,
      read: false,
    });

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/complaints/category/:category
exports.getComplaintsByCategory = async (req, res) => {
  try {
    const complaints = await Complaint.find({ category: req.params.category })
      .populate("user", "name email flatNumber")
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/complaints/stats
// Returns { total, pending, resolved, categoryWise: { Water: 3, Lift: 1, ... } }
exports.getComplaintStats = async (req, res) => {
  try {
    const [total, pending, resolved, categoryAgg] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: "pending" }),
      Complaint.countDocuments({ status: "resolved" }),
      Complaint.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ]),
    ]);

    const categoryWise = {};
    categoryAgg.forEach((c) => {
      categoryWise[c._id || "Other"] = c.count;
    });

    res.json({ total, pending, resolved, categoryWise });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
