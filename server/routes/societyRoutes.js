const express = require("express");
const {
  getSocietyConfig,
  updateSocietyConfig
} = require("../controllers/societyController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", protect, getSocietyConfig); // Admins and Users can view
router.put("/", protect, adminOnly, updateSocietyConfig); // Only Admins can update

module.exports = router;
