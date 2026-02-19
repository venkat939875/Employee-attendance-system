const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true,
    },

    loginTime: {
      type: Date,
    },

    logoutTime: {
      type: Date,
    },

    totalHours: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Present", "Late", "Incomplete","Absent"],
      default: "Present",
    },
  },
  {
    timestamps: true,
  }
);

// 🔥 Prevent duplicate attendance for same employee same date
attendanceSchema.index(
  { employeeId: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
