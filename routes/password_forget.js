const router = require('express').Router();

const ForgotPasswordController = require('../controller/forgot_password.controller.js');

router.post('/', ForgotPasswordController.forgotPassword);

module.exports = router;