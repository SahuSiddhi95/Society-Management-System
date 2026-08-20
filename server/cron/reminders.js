const cron = require("node-cron");
const { sendRemindersLogic } = require("../controllers/maintenanceController");

// Run every day at 10:00 AM
cron.schedule("0 10 * * *", async () => {
  const currentDay = new Date().getDate();
  // Only send automatically from the 1st to the 5th of the month
  if (currentDay >= 1 && currentDay <= 5) {
    console.log(`[Cron] Executing sendRemindersLogic for day ${currentDay}`);
    try {
      const result = await sendRemindersLogic();
      console.log("[Cron] sendRemindersLogic result:", result);
    } catch (error) {
      console.error("[Cron] Error executing sendRemindersLogic:", error);
    }
  }
});

console.log("[Cron] Reminders job scheduled.");
