const rateLimit = require("express-rate-limit");

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  // ↑ 15 minutes in milliseconds
  // 15 × 60 × 1000 = 900,000 ms

  max: 100,
  // ↑ max 100 requests per windowMs

  message: {
    success: false,
    message: "Too many requests, please try again after 15 minutes ⏳",
  },

  // ↑ response when limit exceeded

  standardHeaders: true,

  // ↑ sends rate limit info in response headers
  // X-RateLimit-Limit: 100
  // X-RateLimit-Remaining: 95

  legacyHeaders: false,
  // ↑ disable old headers format
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 10,

  message: {
    success: false,
    message: "Too many login attempts, please try again after 15 minutes ⏳",
  },
});

module.exports = { generalLimiter, authLimiter };