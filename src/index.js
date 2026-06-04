const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

const protect = require("./middleware/authMiddleware.js");

const app = express();

app.use(express.json());

//routes

app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/tasks"));

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
