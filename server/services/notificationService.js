const Notification = require("../models/Notification");

exports.sendInAppNotification = async (user, maintenance) => {
  try {
    await Notification.create({
      user: user._id, // User Object ID
      title: "New Maintenance Due",
      message: `Your maintenance for ${maintenance.month} ${maintenance.year} of ₹${maintenance.amount} has been generated.`,
      type: "maintenance",
      read: false,
    });

    return { success: true };
  } catch (error) {
    console.error(`Failed to create in-app notification for user ${user._id}:`, error.message);
    return { success: false, error: error.message };
  }
};

exports.sendInAppReminderNotification = async (user, maintenance) => {
  try {
    await Notification.create({
      user: user._id, // User Object ID
      title: "Reminder: Maintenance Pending",
      message: `Gentle reminder: Your maintenance for ${maintenance.month} ${maintenance.year} of ₹${maintenance.amount} is still pending.`,
      type: "maintenance",
      read: false,
    });

    return { success: true };
  } catch (error) {
    console.error(`Failed to create in-app reminder notification for user ${user._id}:`, error.message);
    return { success: false, error: error.message };
  }
};
