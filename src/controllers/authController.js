const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError.js")
const asyncWrapper = require("../utils/asyncWrapper.js")

require("dotenv").config();

//register

const register = asyncWrapper(async (req, res, next) => {

    if (!req.body) {
      return next(new AppError("Please provide all fields", 400));
    }

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return next(new AppError("Please provide all fields", 400));
    }

    // const existingUser = await User.findOne({ email });

    // if (existingUser) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "email already registered",
    //   });
    // }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "user created ✅",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
});

//login

const login = asyncWrapper(async (req, res, next) => {

    const { email, password } = req.body || {};

    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(new AppError("Invalid credentials", 401));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new AppError("Invalid credentials", 401));
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      success: true,
      message: "Login successful ✅",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
});

module.exports = { register, login };
