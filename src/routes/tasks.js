const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware.js");
const { createTask, getAllTasks, getOneTask, updateTask, deleteTask } = require("../controllers/taskController.js");

//create task
router.post('/', protect, createTask);

//get all tasks

router.get("/", protect, getAllTasks);

//get one task

router.get("/:id", protect, getOneTask);

//update task

router.put("/:id", protect, updateTask);

//delete task

router.delete("/:id", protect, deleteTask);

module.exports = router;
