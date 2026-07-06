const express = require("express");
const router = express.Router();

const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsByCategory,
  updateEventStatus,
  getEventStats,
} = require("../controllers/eventController");

const { protect } = require("../middleware/authMiddleware");
const {adminOnly} = require("../middleware/roleMiddleware");
console.log(createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsByCategory,
  updateEventStatus,
  getEventStats,)
router.post("/", protect, adminOnly, createEvent);

router.get("/", protect, getAllEvents);

router.get("/stats", protect, adminOnly, getEventStats);

router.get("/category/:category", protect, getEventsByCategory);

router.get("/:id", protect, getEventById);

router.put("/:id", protect, adminOnly, updateEvent);

router.patch(
  "/status/:id",
  protect,
  adminOnly,
  updateEventStatus
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteEvent
);

module.exports = router;