// routes/adminRoutes.js
const express = require("express");
const {
  createUser,
  createAdmin,
  getAllUsers,
  deleteUser,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/create-user", protect, adminOnly, createUser);
router.post("/create-admin",createAdmin )
router.get("/users", protect, adminOnly, getAllUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);

module.exports = router;
