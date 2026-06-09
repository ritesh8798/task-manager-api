const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController.js");
const { registerValidations,loginValidations } = require("../validators/authValidator.js");
const validateRequest = require("../middleware/validateRequest.js")


//register
router.post('/register',registerValidations, validateRequest, register);

//login
router.post('/login',loginValidations, validateRequest, login);

module.exports = router