const Razorpay = require('razorpay');

const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_TTxYjBQ1SKwckh";
const key_secret = process.env.RAZORPAY_KEY_SECRET || "fD3z2BfS0lDhUiMrBo06pbq3";


if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.log('[INFO] Using fallback Razorpay test keys');
}

const razorpayInstance = new Razorpay({
  key_id,
  key_secret,
});

module.exports = razorpayInstance;