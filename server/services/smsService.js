const twilio = require("twilio");

let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

exports.sendMaintenanceSMS = async (user, maintenance) => {
  if (!user.phone) return { success: false, error: "No phone number provided" };

  const message = `Hello ${user.name}, your maintenance of Rs.${maintenance.amount} for ${maintenance.month} ${maintenance.year} is due on ${new Date(maintenance.dueDate).toLocaleDateString("en-IN")}. Please pay on time.`;

  try {
    if (!twilioClient) {
      console.log(`[Mock SMS] Sent to ${user.phone}: ${message}`);
      return { success: true, mocked: true };
    }

    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER || "+1234567890",
      to: user.phone.startsWith('+') ? user.phone : `+91${user.phone}` // Default to India prefix if none provided
    });

    return { success: true };
  } catch (error) {
    console.error(`Failed to send SMS to ${user.phone}:`, error.message);
    return { success: false, error: error.message };
  }
};

exports.sendMaintenanceReminderSMS = async (user, maintenance) => {
  if (!user.phone) return { success: false, error: "No phone number provided" };

  const message = `Reminder: Hello ${user.name}, your maintenance of Rs.${maintenance.amount} for ${maintenance.month} ${maintenance.year} is still pending. Please clear your dues as soon as possible.`;

  try {
    if (!twilioClient) {
      console.log(`[Mock SMS Reminder] Sent to ${user.phone}: ${message}`);
      return { success: true, mocked: true };
    }

    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER || "+1234567890",
      to: user.phone.startsWith('+') ? user.phone : `+91${user.phone}`
    });

    return { success: true };
  } catch (error) {
    console.error(`Failed to send SMS Reminder to ${user.phone}:`, error.message);
    return { success: false, error: error.message };
  }
};
