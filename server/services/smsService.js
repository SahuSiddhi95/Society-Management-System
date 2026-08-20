// services/smsService.js

const MC_AUTH_URL = "https://cpaas.messagecentral.com/auth/v1/authentication/token";
const MC_SEND_URL = "https://cpaas.messagecentral.com/verification/v3/send";

let cachedToken = null;
let tokenExpiry = null;

async function getAuthToken() {
  if (!process.env.MESSAGE_CENTRAL_CUSTOMER_ID || !process.env.MESSAGE_CENTRAL_PASSWORD) {
    throw new Error("Message Central credentials missing");
  }

  // Return cached token if valid (assuming 1 hr expiry)
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const base64Password = Buffer.from(process.env.MESSAGE_CENTRAL_PASSWORD).toString('base64');
  
  const params = new URLSearchParams({
    customerId: process.env.MESSAGE_CENTRAL_CUSTOMER_ID,
    key: base64Password,
    scope: "NEW"
  });

  const response = await fetch(`${MC_AUTH_URL}?${params.toString()}`, {
    method: "GET",
    headers: {
      "accept": "*/*"
    }
  });

  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    console.error("Failed to parse Auth JSON:", text);
  }

  if (!response.ok || data.status !== 200 || !data.token) {
    throw new Error(`Auth failed (${response.status}): ${data.message || 'Invalid credentials or empty response'}`);
  }

  cachedToken = data.token;
  tokenExpiry = Date.now() + 3600000; // Cache for 1 hour
  return cachedToken;
}

async function sendSMS(to, message) {
  try {
    // Mock send if credentials are not provided
    if (!process.env.MESSAGE_CENTRAL_CUSTOMER_ID || !process.env.MESSAGE_CENTRAL_PASSWORD) {
      console.log(`[Mock SMS] Sent to ${to}: ${message}`);
      return { success: true, mocked: true };
    }

    const token = await getAuthToken();

    const cleanPhone = to.replace(/\D/g, '');
    let countryCode = "91"; // Default to India
    let mobileNumber = cleanPhone;

    if (cleanPhone.length > 10 && cleanPhone.startsWith("91")) {
      countryCode = "91";
      mobileNumber = cleanPhone.substring(2);
    }

    const params = new URLSearchParams({
      countryCode: countryCode,
      flowType: "SMS",
      mobileNumber: mobileNumber,
      senderId: process.env.MESSAGE_CENTRAL_SENDER_ID || "SOCYOS", // Fallback Sender ID
      type: "SMS",
      message: message,
      messageType: "TRANSACTIONAL" // Defaulting to Transactional for maintenance alerts
    });

    const response = await fetch(`${MC_SEND_URL}?${params.toString()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authToken": token
      }
    });

    const text = await response.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      console.error("Failed to parse Send SMS JSON:", text);
    }

    if (!response.ok || data.responseCode !== 200) {
      throw new Error(`Send failed (${response.status}): ${data.responseDescription || data.message || 'Unknown error'}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error(`Failed to send SMS to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
}

exports.sendMaintenanceSMS = async (user, maintenance) => {
  if (!user.phone) return { success: false, error: "No phone number provided" };

  // TEMPORARY TEST: Using the default approved template to bypass DLT blocks
  // const message = `Hello ${user.name}, your maintenance of Rs.${maintenance.amount} for ${maintenance.month} ${maintenance.year} is due on ${new Date(maintenance.dueDate).toLocaleDateString("en-IN")}. Please pay on time.`;
  const message = `Welcome to Message Central. We are delighted to have you here! - Powered by U2opia`;
  
  return await sendSMS(user.phone, message);
};

exports.sendMaintenanceReminderSMS = async (user, maintenance) => {
  if (!user.phone) return { success: false, error: "No phone number provided" };

  const message = `Reminder: Hello ${user.name}, your maintenance of Rs.${maintenance.amount} for ${maintenance.month} ${maintenance.year} is still pending. Please clear your dues as soon as possible.`;
  return await sendSMS(user.phone, message);
};
