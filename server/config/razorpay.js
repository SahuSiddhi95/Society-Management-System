const Razorpay = require('razorpay');

// =========================================================================
// IMPORTANT: Add these to your .env file (never hardcode or commit keys)
//   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
//   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
//
// Get these from: Razorpay Dashboard -> Settings -> API Keys -> Generate Test Key
// =========================================================================

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn(
    '[WARNING] Razorpay keys are missing in .env. Payment routes will fail until you add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.'
  );
}

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = razorpayInstance;