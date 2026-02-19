const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,

  email: {
    type: String,
    unique: true,
    required: true,
  },

  password: {
    type: String, // NOT required at signup
  },

  role: {
    type: String,
    enum: ["admin", "employee"],
    required: true,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  otp: String,
  otpExpiry: Date,

  // ✅ NEW FIELD FOR SECURITY
  otpAttempts: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("User", userSchema);
