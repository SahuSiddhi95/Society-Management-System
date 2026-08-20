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
  logout,
  getAdminContact,
  googleLogin
} = require("../controllers/authControllers");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/admin-login", adminLogin);
router.post("/user-login", userLogin);
router.post("/google-login", googleLogin);
router.post("/forgot-password", forgotPassword);
router.get("/details", protect, getUserDetails);
// VERIFY OTP
router.post("/verify-otp", verifyOtp);
// RESEND OTP
router.post("/resend-otp", resendOtp);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);
router.get("/admin-contact", getAdminContact);

module.exports = router;
