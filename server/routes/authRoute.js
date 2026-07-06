// routes/authRoutes.js
const express = require("express");
const {
  login,
  forgotPassword,
  resetPassword,
  verifyOtp,
  resendOtp,
  getUserDetails,
  adminLogin,
  userLogin,
  logout
} = require("../controllers/authControllers");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/admin-login", adminLogin);
router.post("/user-login", userLogin);
router.post("/forgot-password", forgotPassword);
router.get("/details", protect , getUserDetails);
// VERIFY OTP
router.post("/verify-otp", verifyOtp);
// RESEND OTP
router.post("/resend-otp", resendOtp);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);

module.exports = router;
