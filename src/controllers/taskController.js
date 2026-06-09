const Task = require("../models/Task.js");
const User = require("../models/User.js");
const AppError = require("../utils/AppError.js");
const asyncWrapper = require("../utils/asyncWrapper.js");

// ─── CREATE TASK ─────────────────────────────────────
const createTask = asyncWrapper(async (req, res, next) => {
  const { title, description } = req.body;

  if (!title) {
    return next(new AppError("Title is required", 400));
  }

  const task = await Task.create({
    title,
    description,
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Task created ✅",
    task,
  });
});

// ─── GET ALL TASKS ───────────────────────────────────
const getAllTasks = asyncWrapper(async (req, res, next) => {
  // Step 1: Get from URL
  const { page, limit, status, search } = req.query;

  // Step 2: Convert to numbers
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;

  // Step 3: Calculate skip
  const skip = (pageNumber - 1) * limitNumber;

  // Step 4: Build filter
  const filter = { user: req.user._id };
  if (status) filter.status = status;
  if (search) filter.title = { $regex: search, $options: "i" };

  // Step 5: Count total
  const totalTasks = await Task.countDocuments(filter);

  // Step 6: Fetch tasks
  const tasks = await Task.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber);

  // Step 7: Calculate pages
  const totalPages = Math.ceil(totalTasks / limitNumber);

  // Step 8: Send response
  res.json({
    success: true,
    totalTasks,
    totalPages,
    currentPage: pageNumber,
    tasks,
  });
});

// ─── GET ONE TASK ────────────────────────────────────
const getOneTask = asyncWrapper(async (req, res, next) => {
  // finds task AND checks ownership in ONE query
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) {
    return next(new AppError("Task not found", 404));
  }

  res.json({
    success: true,
    task,
  });
});

// ─── UPDATE TASK ─────────────────────────────────────
const updateTask = asyncWrapper(async (req, res, next) => {
  // finds, checks ownership, updates — ONE query
  const task = await Task.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id,
    },
    req.body,
    {
      returnDocument: "after", // return updated task
      runValidators: true, // run schema validators
    },
  );

  if (!task) {
    return next(new AppError("Task not found ❌", 404));
  }

  res.json({
    success: true,
    message: "Task updated ✅",
    task,
  });
});

// ─── DELETE TASK ─────────────────────────────────────
const deleteTask = asyncWrapper(async (req, res, next) => {
  // finds, checks ownership, deletes — ONE query
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) {
    return next(new AppError("Task not found ❌", 404));
  }

  res.json({
    success: true,
    message: "Task deleted ✅",
  });
});

module.exports = {
  createTask,
  getAllTasks,
  getOneTask,
  updateTask,
  deleteTask,
};
