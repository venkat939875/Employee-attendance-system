const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");

const {
  markLogin,
  markLogout,
  getMyAttendance,
  getAllAttendance,
  exportAttendanceCSV,
} = require("../controllers/attendanceController");

const router = express.Router();

/* =====================================================
   EMPLOYEE ROUTES
===================================================== */

// Mark attendance (Login)
router.post(
  "/login",
  protect,
  authorize("employee"),
  markLogin
);

// Mark logout
router.post(
  "/logout",
  protect,
  authorize("employee"),
  markLogout
);

// Get logged-in employee attendance history
router.get(
  "/my",
  protect,
  authorize("employee"),
  getMyAttendance
);


/* =====================================================
   ADMIN ROUTES
===================================================== */

// Get all attendance records
router.get(
  "/admin/attendance",
  protect,
  authorize("admin"),
  getAllAttendance
);

// Export attendance as CSV
router.get(
  "/admin/export",
  protect,
  authorize("admin"),
  exportAttendanceCSV
);

module.exports = router;
