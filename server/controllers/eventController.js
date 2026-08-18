const Event = require("../models/events");
const  Notification = require("../models/Notification")
// Create Event
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);

    const users = await User.find({ role: "user" });

    await Notification.insertMany(
      users.map((user) => ({
        title: "📅 New Event",
        message: `${event.title} has been scheduled.`,
        type: "event",
        user: user._id,
      })),
    );
    res.status(201).json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({
      createdAt: -1,
    });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Event By Id
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Category Wise Events
exports.getEventsByCategory = async (req, res) => {
  try {
    const events = await Event.find({
      category: req.params.category,
    });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Status
exports.updateEventStatus = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
      },
    );

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Stats
exports.getEventStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();

    const upcomingEvents = await Event.countDocuments({
      status: "Upcoming",
    });

    const completedEvents = await Event.countDocuments({
      status: "Completed",
    });

    const cancelledEvents = await Event.countDocuments({
      status: "Cancelled",
    });

    res.status(200).json({
      totalEvents,
      upcomingEvents,
      completedEvents,
      cancelledEvents,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
