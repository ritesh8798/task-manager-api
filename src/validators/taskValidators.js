const { body, param, query } = require("express-validator");
//      ↑ body for req.body fields
//             ↑ param for req.params fields (:id)

//create Task validation

const createTaskValidations = [
  body("title").notEmpty().withMessage("Title is required"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be text"),

  body("status")
    .optional()
    .isIn(["pending", "in-progress", "completed"])
    .withMessage("status must be pending,in-progress or completed"),
];

//get all task validations

const getAllTaskValidations = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be a positive number"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("status")
    .optional()
    .isIn(["pending", "in-progress", "completed"])
    .withMessage("Invalid status value"),
];

//update Task validation

const updateTaskValidations = [
  param("id").isMongoId().withMessage("Invalid Task ID"),

  body("title").notEmpty().withMessage("Title is required"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be text"),

  body("status").optional().isIn(["pending", "in-progress", "completed"]),
];

//delete Task validation and get one task validation

const taskIDValidations = [
  param("id").isMongoId().withMessage("Invalid Task ID"),
];

module.exports = {
  createTaskValidations,
  updateTaskValidations,
  taskIDValidations,
  getAllTaskValidations
};
