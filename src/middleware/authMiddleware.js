const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
require("dotenv").config();

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        success: false,
        message: "No token provided, access denied ❌",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    req.user = user;

    next();
  } catch (error) {
     if (error.name === "TokenExpiredError") {
       return res
         .status(401)
         .json({
           success: false,
           message: "Token expired, please login again",
         });
     }
     return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

module.exports = protect;
