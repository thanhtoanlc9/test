const express = require('express');
const validator = require('validator');
const passport = require('passport');

const router = new express.Router();

/**
 * Validate the login form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateLoginForm(payload) {

  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.email !== 'string' || payload.email.trim().length === 0) {
    isFormValid = false;
    errors.email = 'Hay cung cấp địa chỉ email của bạn(Email).';
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
    isFormValid = false;
    errors.password = 'Hãy cung cấp mật khẩu tài khoản của bạn.';
  }

  if (!isFormValid) {
    message = 'Xảy ra sự cố với các thông tin truyền đi.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}


router.post('/', (req, res, next) => {

  const validationResult = validateLoginForm(req.body);
  if (!validationResult.success) {
    return res.json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }

  return passport.authenticate('local-login', (err, token, userData) => {
    if (err) {
      if (err.name === 'IncorrectCredentialsError') {
        return res.json({
          success: false,
          message: err.message
        });
      }

      return res.json({
        success: false,
        message: 'Đăng nhập không thành công.'
      });
    }


    return res.json({
      success: true,
      message: 'Bạn đã đăng nhập tài khoản thành công!',
      token,
      name: userData.name
    });
  })(req, res, next);
});


module.exports = router;