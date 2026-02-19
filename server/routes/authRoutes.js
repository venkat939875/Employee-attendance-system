const express = require("express");

const {
  signup,
  verifyOtp,
  login,
  verifyLoginOtp,
  forgotPassword,
  resetPassword,
  logout, // ✅ Added logout
} = require("../controllers/authController");

const authLimiter = require("../middleware/rateLimitMiddleware");

const router = express.Router();

// 🔐 Apply rate limiter to all auth routes
router.use(authLimiter);

/* =====================================================
   SIGNUP FLOW
===================================================== */

// Step 1: Signup → send OTP
router.post("/signup", signup);

// Step 2: Verify OTP + set password
router.post("/verify-otp", verifyOtp);


/* =====================================================
   LOGIN FLOW
===================================================== */

// Step 1: Login → send OTP
router.post("/login", login);

// Step 2: Verify login OTP → set cookie
router.post("/verify-login-otp", verifyLoginOtp);

// Step 3: Logout → clear cookie
router.post("/logout", logout); // ✅ NEW


/* =====================================================
   FORGOT PASSWORD FLOW
===================================================== */

// Step 1: Send reset OTP
router.post("/forgot-password", forgotPassword);

// Step 2: Verify OTP + reset password
router.post("/reset-password", resetPassword);


module.exports = router;
