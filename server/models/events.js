const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    category: {
      type: String,
      enum: [
        "Festival",
        "Meeting",
        "Sports",
        "Cultural",
        "Maintenance",
        "Kids Activity",
        "Workshop",
        "Other",
      ],
      required: true,
    },

    date: { type: Date, required: true },

    startTime: String,
    endTime: String,

    location: String,
    organizer: String,

    image: String,

    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed", "Cancelled"],
      default: "Upcoming",
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);