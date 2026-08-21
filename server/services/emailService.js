const nodemailer = require("nodemailer");

// Create transporter outside the function so it's reused
// Falls back to a mock/console transport if missing credentials, to prevent crashes
let transporter;

try {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "placeholder@gmail.com",
      pass: process.env.EMAIL_PASS || "placeholder",
    },
  });
} catch (error) {
  console.error("Failed to initialize Nodemailer transporter:", error.message);
}

exports.sendMaintenanceEmail = async (user, maintenance) => {
  if (!user.email) return { success: false, error: "No email provided" };

  const mailOptions = {
    from: process.env.EMAIL_USER || "Society Admin <admin@society.com>",
    to: user.email,
    subject: `${maintenance.category || 'Maintenance'} Due - ${maintenance.month} ${maintenance.year}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hello ${user.name},</h2>
        <p>Your <strong>${maintenance.category || 'Maintenance'}</strong> dues for <strong>${maintenance.month} ${maintenance.year}</strong> have been generated.</p>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 16px;">Amount Due: <strong style="font-size: 24px; color: #4f46e5;">₹${maintenance.amount}</strong></p>
          <p style="margin: 10px 0 0 0; color: #64748b;">Due Date: ${new Date(maintenance.dueDate).toLocaleDateString("en-IN")}</p>
        </div>
        <p>Please clear your dues by the due date to avoid any late payment charges.</p>
        <p>Best regards,<br>Society Management</p>
      </div>
    `,
  };

  try {
    // If no real credentials exist, just log it as a success for dev environments
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`[Mock Email] Sent to ${user.email} for ₹${maintenance.amount}`);
      return { success: true, mocked: true };
    }

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error(`Failed to send email to ${user.email}:`, error.message);
    return { success: false, error: error.message };
  }
};

exports.sendMaintenanceReminderEmail = async (user, maintenance) => {
  if (!user.email) return { success: false, error: "No email provided" };

  const mailOptions = {
    from: process.env.EMAIL_USER || "Society Admin <admin@society.com>",
    to: user.email,
    subject: `Reminder: ${maintenance.category || 'Maintenance'} Due - ${maintenance.month} ${maintenance.year}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hello ${user.name},</h2>
        <p>This is a gentle reminder that your <strong>${maintenance.category || 'Maintenance'}</strong> dues for <strong>${maintenance.month} ${maintenance.year}</strong> are pending.</p>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 16px;">Amount Due: <strong style="font-size: 24px; color: #4f46e5;">₹${maintenance.amount}</strong></p>
          <p style="margin: 10px 0 0 0; color: #64748b;">Due Date: ${new Date(maintenance.dueDate).toLocaleDateString("en-IN")}</p>
        </div>
        <p>Please clear your dues as soon as possible to avoid late payment charges.</p>
        <p>Best regards,<br>Society Management</p>
      </div>
    `,
  };

  // We rely on transporter defined at the top of the file
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`[Mock Email Reminder] Sent to ${user.email} for ₹${maintenance.amount}`);
      return { success: true, mocked: true };
    }

    // NOTE: This assumes 'transporter' is in the outer scope, which it is.
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error(`Failed to send reminder email to ${user.email}:`, error.message);
    return { success: false, error: error.message };
  }
};
