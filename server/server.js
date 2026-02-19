const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

const { protect, authorize } = require("./middleware/authMiddleware");
const { autoMarkAbsent } = require("./controllers/attendanceController");

const app = express();

// ================= SECURITY =================
app.use(helmet());

// ================= CORS CONFIG =================
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow non-browser tools (Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // 🔥 REQUIRED for cookies
  })
);

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(cookieParser()); // 🔥 REQUIRED to read cookies

// ================= DATABASE =================
connectDB()
  .then(() => {
    console.log("Database Connected");
    autoMarkAbsent(); // optional demo feature
  })
  .catch((err) => {
    console.error("DB Connection Failed:", err.message);
  });

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);

// ================= PROTECTED TEST ROUTES =================
app.get(
  "/api/admin/test",
  protect,
  authorize("admin"),
  (req, res) => {
    res.json({
      message: "Admin access granted",
      user: req.user,
    });
  }
);

app.get(
  "/api/user/test",
  protect,
  (req, res) => {
    res.json({
      message: "User authenticated",
      user: req.user,
    });
  }
);

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Attendance Backend Running",
  });
});

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);

  // Handle CORS errors cleanly
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      message: "CORS Error: Origin not allowed",
    });
  }

  res.status(500).json({
    message: "Something went wrong",
  });
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
