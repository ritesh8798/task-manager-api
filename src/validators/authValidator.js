const { body } = require("express-validator");

const registerValidations = [
    body("name")
        .notEmpty()
        .withMessage("Name is required"),

    body("email")
        .isEmail()
        .withMessage("Invalid Email"),
    
    body("password")
        .isLength({ min: 6 })
        .withMessage("password must be atleast 6 characters.")
]

const loginValidations = [
    body("email")
        .isEmail()
        .withMessage("Invalid Email"),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
]

module.exports = { registerValidations, loginValidations };