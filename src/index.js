const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();


const protect = require("./middleware/authMiddleware.js");
const errorHandler = require("./utils/errorHandler.js");
const {generalLimiter, authLimiter} = require("./config/rateLimiter.js")

const app = express();

//logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  // colorful logs in development
} else {
  app.use(morgan("combined"));
  // detailed logs in production
}

// ─── SECURITY ────────────────────────────────────────

// 1. Helmet — removes X-Powered-By, adds security headers
app.use(helmet());

// 2. CORS — controls who can access API
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production" ? process.env.ALLOWED_ORIGIN : "*",
    // In production → only allowed origin
    // In development → allow everything (easier testing)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// 3. Rate limiting — prevents too many requests
app.use(generalLimiter);

//BODY PARSER
app.use(express.json());

//routes
app.use("/api/v1/auth", authLimiter, require("./routes/auth"));
app.use("/api/v1/tasks", require("./routes/tasks"));

//error handler
app.use(errorHandler);

//DATABASE + SERVER
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected successfully ✅");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 SERVER IS RUNNING ON PORT ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database connection error ❌", err);
    process.exit(1);
  });
