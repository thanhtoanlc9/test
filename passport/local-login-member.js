const jwt = require('jsonwebtoken');
const Member = require('mongoose').model('Member');
const PassportLocalStrategy = require('passport-local').Strategy;
const config = require('../config');


/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, email, password, done) => {
  
  const userData = {
    email: email.trim(),
    password: password.trim()
  };

  // find a user by email address
  return Member.findOne({ $or: [{email: email}, {username: email}] }, (err, user) => {
    if (err) { return done(err); }

    if (!user) {
      const error = new Error('Incorrect email or password');
      error.name = 'IncorrectCredentialsError';

      return done(error);
    }

    // check if a hashed user's password is equal to a value saved in the database
    return user.comparePassword(userData.password, (passwordErr, isMatch) => {
      if (err) { return done(err); }

      if (!isMatch) {
        const error = new Error('Incorrect email or password');
        error.name = 'IncorrectCredentialsError';

        return done(error);
      }

      var id = user._id;

      Member.update({ _id: id }, {lastlogin: new Date()}, { upsert: false, multi: false }, (err, success) => {
          if (err) return done(err);
      });

      const payload = {
        _id: user._id,
        username: user.username,
        fullname: user.fullname
      };

      // create a token string
      const token = jwt.sign(payload, config.jwtSecret);
      const data = {
        username: user.username,
        fullname: user.fullname
      };

      return done(null, token, data);
    });
  });
});
