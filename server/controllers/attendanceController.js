const Attendance = require("../models/Attendance");
const User = require("../models/User");
const { Parser } = require("json2csv");

// ================= HELPER =================
const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

// ================= MARK LOGIN =================
exports.markLogin = async (req, res) => {
  try {
    const today = getTodayDate();

    let attendance = await Attendance.findOne({
      employeeId: req.user.id,
      date: today,
    });

    const user = await User.findById(req.user.id).select("name");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const now = new Date();

    const lateThreshold = new Date();
    lateThreshold.setHours(9, 30, 0, 0);

    const status = now > lateThreshold ? "Late" : "Present";

    // 🔥 If record already exists (auto absent case)
    if (attendance) {
      // If login already marked
      if (attendance.loginTime) {
        return res.status(400).json({
          message: "You already marked attendance today",
        });
      }

      // Update existing Absent record
      attendance.loginTime = now;
      attendance.status = status;
      attendance.totalHours = 0;

      await attendance.save();

      return res.status(200).json(attendance);
    }

    // 🔥 If no record exists
    attendance = await Attendance.create({
      employeeId: req.user.id,
      name: user.name,
      date: today,
      loginTime: now,
      status,
    });

    return res.status(201).json(attendance);

  } catch (error) {
    console.error("Mark Login Error:", error);
    return res.status(500).json({
      message: "Failed to mark attendance",
    });
  }
};

// ================= MARK LOGOUT =================
exports.markLogout = async (req, res) => {
  try {
    const today = getTodayDate();

    const attendance = await Attendance.findOne({
      employeeId: req.user.id,
      date: today,
    });

    if (!attendance) {
      return res.status(400).json({
        message: "You must mark attendance first",
      });
    }

    if (!attendance.loginTime) {
      return res.status(400).json({
        message: "Login not marked yet",
      });
    }

    if (attendance.logoutTime) {
      return res.status(400).json({
        message: "You already logged out today",
      });
    }

    const now = new Date();
    attendance.logoutTime = now;

    const diffHours =
      (attendance.logoutTime - attendance.loginTime) /
      (1000 * 60 * 60);

    attendance.totalHours = Number(diffHours.toFixed(2));

    if (attendance.totalHours < 8) {
      attendance.status = "Incomplete";
    } else {
      attendance.status = "Present";
    }

    await attendance.save();

    return res.status(200).json(attendance);

  } catch (error) {
    console.error("Mark Logout Error:", error);
    return res.status(500).json({
      message: "Failed to mark logout",
    });
  }
};

// ================= GET MY ATTENDANCE =================
exports.getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({
      employeeId: req.user.id,
    }).sort({ date: -1, createdAt: -1 });

    return res.status(200).json(records);

  } catch (error) {
    console.error("Fetch Attendance Error:", error);
    return res.status(500).json({
      message: "Failed to fetch attendance records",
    });
  }
};

// ================= ADMIN: GET ALL ATTENDANCE =================
exports.getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find()
      .sort({ date: -1, createdAt: -1 });

    return res.status(200).json(records);

  } catch (error) {
    console.error("Admin Fetch Attendance Error:", error);
    return res.status(500).json({
      message: "Failed to fetch attendance records",
    });
  }
};

// ================= AUTO MARK ABSENT =================
exports.autoMarkAbsent = async () => {
  try {
    const today = getTodayDate();

    const employees = await User.find({
      role: "employee",
      isVerified: true,
    });

    for (let user of employees) {
      const existing = await Attendance.findOne({
        employeeId: user._id,
        date: today,
      });

      if (!existing) {
        await Attendance.create({
          employeeId: user._id,
          name: user.name,
          date: today,
          totalHours: 0,
          status: "Absent",
        });
      }
    }

    console.log("Auto Absent Check Completed");

  } catch (error) {
    console.error("Auto Mark Absent Error:", error);
  }
};

// ================= EXPORT CSV =================
exports.exportAttendanceCSV = async (req, res) => {
  try {
    const records = await Attendance.find().sort({ date: -1 });

    if (!records.length) {
      return res.status(404).json({
        message: "No attendance records found",
      });
    }

    const formattedData = records.map(record => ({
      name: record.name,
      date: record.date,
      loginTime: record.loginTime
        ? new Date(record.loginTime).toLocaleString()
        : "-",
      logoutTime: record.logoutTime
        ? new Date(record.logoutTime).toLocaleString()
        : "-",
      totalHours: record.totalHours,
      status: record.status,
    }));

    const fields = [
      { label: "Employee Name", value: "name" },
      { label: "Date", value: "date" },
      { label: "Login Time", value: "loginTime" },
      { label: "Logout Time", value: "logoutTime" },
      { label: "Total Hours", value: "totalHours" },
      { label: "Status", value: "status" },
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(formattedData);

    res.header("Content-Type", "text/csv");
    res.attachment("attendance-report.csv");
    return res.send(csv);

  } catch (error) {
    console.error("CSV Export Error:", error);
    return res.status(500).json({
      message: "Failed to export CSV",
    });
  }
};
