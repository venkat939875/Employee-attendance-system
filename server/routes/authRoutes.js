const express = require("express");
const { signup, login } = require("../controllers/authController");
const authLimiter = require("../middleware/rateLimitMiddleware");

const router = express.Router();

router.use(authLimiter);

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
