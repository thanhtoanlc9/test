const express = require('express');
const validator = require('validator');
const passport = require('passport');

var Member = require('mongoose').model('Member');

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

  if (!payload || typeof payload.username !== 'string' || payload.username.trim().length === 0) {
    isFormValid = false;
    errors.username = 'Hãy cung cáp tên tài khoản hoặc email của bạn.';
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
    isFormValid = false;
    errors.password = 'Hãy cung cấp mật khẩu.';
  }

  if (!isFormValid) {
    message = 'Xảy ra lỗi nhập thông tin tài khoản.';
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

  return passport.authenticate('local-login-member', (err, token, userData) => {
    if (err) {
      if (err.name === 'IncorrectCredentialsError') {
        return res.json({
          success: false,
          message: err.message
        });
      }

      return res.json({
        success: false,
        message: 'Đăng nhập tài khoản không thành công.'
      });
    }

    return res.json({
      success: true,
      message: 'Bạn đã đăng nhập thành công!',
      token: token,
      username: userData.username,
      fullname: userData.fullname
    });

  })(req, res, next);

});


// Change password
router.put('/', (req, res, next) => {

  const validationResult = validateLoginForm(req.body);
  if (!validationResult.success) {
    return res.json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }

  return passport.authenticate('local-login-member', (err, token, userData) => {
    if (err) {
      if (err.name === 'IncorrectCredentialsError') {
        return res.json({
          success: false,
          message: err.message
        });
      }

      return res.json({
        success: false,
        message: 'Cung cấp thông tin chưa đúng.'
      });
    }
    
    Member.findOne({ username: userData.username }, (err, user) => {

      user.password = req.body.changed_password;

      user.save((err, success) => {

        if (err) return res.send(err);

        return res.json({
          success: true,
          message: 'Bạn đã đổi mật khẩu thành công.',
        });

      });

    });
    
  })(req, res, next);

});



module.exports = router;