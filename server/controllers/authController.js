const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateOtp = require("../utils/generateOtp");
const sendEmail = require("../utils/sendEmail");


// ================= SIGNUP (SEND OTP) =================
exports.signup = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({
        message: "Name, email and role are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    if (!["admin", "employee"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const otp = generateOtp();

    const user = new User({
      name,
      email,
      role,
      isVerified: false,
      otp,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
      otpAttempts: 0,
    });

    await user.save();

    await sendEmail(
      email,
      "Verify your account",
      `Your OTP is ${otp}. It expires in 10 minutes.`
    );

    res.status(201).json({ message: "OTP sent to email" });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Signup failed" });
  }
};


// ================= VERIFY OTP (SET PASSWORD) =================
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({
        message: "Email, OTP and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      user.otp = null;
      await user.save();
      return res.status(400).json({ message: "OTP expired" });
    }

    if (!user.otp || String(user.otp) !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ message: "Account verified successfully" });

  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "OTP verification failed" });
  }
};


// ================= LOGIN (SEND OTP) =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user || !user.password) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Account not verified",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const otp = generateOtp();

    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmail(
      email,
      "Login OTP",
      `Your login OTP is ${otp}. It expires in 10 minutes.`
    );

    res.json({ message: "OTP sent for login" });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};


// ================= VERIFY LOGIN OTP (SET COOKIE) =================
exports.verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid request" });

    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      user.otp = null;
      await user.save();
      return res.status(400).json({ message: "OTP expired" });
    }

    if (!user.otp || String(user.otp) !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ SET SECURE COOKIE
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // change to true in production (https)
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      role: user.role,
    });

  } catch (error) {
    console.error("Login OTP error:", error);
    res.status(500).json({ message: "OTP login failed" });
  }
};


// ================= LOGOUT =================
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};


// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOtp();

    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmail(
      email,
      "Password Reset OTP",
      `Your password reset OTP is ${otp}. It expires in 10 minutes.`
    );

    res.json({ message: "Reset OTP sent to email" });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Failed to send reset OTP" });
  }
};


// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid request" });

    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      user.otp = null;
      await user.save();
      return res.status(400).json({ message: "OTP expired" });
    }

    if (!user.otp || String(user.otp) !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Password reset failed" });
  }
};
