const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware.js");
const { createTask, getAllTasks, getOneTask, updateTask, deleteTask } = require("../controllers/taskController.js");
const { createTaskValidations, updateTaskValidations, taskIDValidations, getAllTaskValidations } = require("../validators/taskValidators.js");
const validateRequest = require("../middleware/validateRequest.js");

//create task
router.post('/', protect, createTaskValidations, validateRequest, createTask);

//get all tasks - no validations needed
router.get("/", protect, getAllTaskValidations, validateRequest, getAllTasks);

//get one task

router.get("/:id", protect, taskIDValidations, validateRequest, getOneTask);

//update task

router.put("/:id", protect, updateTaskValidations, validateRequest, updateTask);

//delete task

router.delete("/:id", protect, taskIDValidations, validateRequest, deleteTask);

module.exports = router;
