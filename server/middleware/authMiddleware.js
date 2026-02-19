const jwt = require("jsonwebtoken");

// ================= PROTECT MIDDLEWARE =================
exports.protect = (req, res, next) => {
  try {
    // ✅ Read token from httpOnly cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Not authenticated. Token missing.",
      });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded; // { id, role, name }

    next();

  } catch (error) {
    console.error("Auth Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired. Please login again.",
      });
    }

    return res.status(401).json({
      message: "Invalid token. Please login again.",
    });
  }
};


// ================= ROLE-BASED AUTHORIZATION =================
exports.authorize = (...roles) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    next();
  };
};
