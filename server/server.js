const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

const { protect, authorize } = require("./middleware/authMiddleware");
const { autoMarkAbsent } = require("./controllers/attendanceController");

const app = express();

app.use(helmet());
app.use(express.json());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); 

      // Allow localhost
      if (origin === "http://localhost:3000") {
        return callback(null, true);
      }

      // Allow ALL your Vercel deployments
      if (origin.includes("vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Handle preflight requests
app.options("*", cors());

connectDB()
  .then(() => {
    console.log("Database Connected");
    autoMarkAbsent();
  })
  .catch((err) => {
    console.error("DB Connection Failed:", err.message);
  });

app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);

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

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Attendance Backend Running",
  });
});

app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      message: "CORS Error: Origin not allowed",
    });
  }

  res.status(500).json({
    message: "Something went wrong",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
