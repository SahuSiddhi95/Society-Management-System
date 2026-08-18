const axios = require("axios");

exports.sendMaintenanceSMS = async (user, maintenance) => {
  if (!user.phone) return { success: false, error: "No phone number provided" };

  const message = `Hello ${user.name}, your maintenance of Rs.${maintenance.amount} for ${maintenance.month} ${maintenance.year} is due on ${new Date(maintenance.dueDate).toLocaleDateString("en-IN")}. Please pay on time.`;

  try {
    if (!process.env.MSG91_AUTH_KEY) {
      // Mock delivery if no key provided
      console.log(`[Mock SMS] Sent to ${user.phone}: ${message}`);
      return { success: true, mocked: true };
    }

    // Generic placeholder for MSG91 or similar SMS provider API call
    // Note: Adjust the URL and payload format according to the exact provider documentation
    await axios.post(
      "https://control.msg91.com/api/v5/flow/",
      {
        template_id: process.env.MSG91_TEMPLATE_ID || "template_id",
        short_url: "0",
        recipients: [
          {
            mobiles: user.phone,
            name: user.name,
            amount: maintenance.amount,
            month: maintenance.month,
            year: maintenance.year,
            due_date: new Date(maintenance.dueDate).toLocaleDateString("en-IN"),
          },
        ],
      },
      {
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true };
  } catch (error) {
    console.error(`Failed to send SMS to ${user.phone}:`, error.message);
    return { success: false, error: error.message };
  }
};
