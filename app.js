var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var config = require('./config');
var passport = require('passport');
var favicon = require('serve-favicon');
var logger = require('morgan');
var compression = require('compression');
var cors = require('cors');

require('./models').connect(config.dbUri);

var app = express();

// Log
app.use(logger('dev'));

// use it before all route definitions
app.use(cors({origin: true}));

// View
app.use(compression());
app.use(express.static(__dirname + '/build'));
app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// pass the passport middleware
app.use(passport.initialize());

// load passport strategies
var localLoginStrategy = require('./passport/local-login');
passport.use('local-login', localLoginStrategy);

var localLoginMemberStrategy = require('./passport/local-login-member');
passport.use('local-login-member', localLoginMemberStrategy);

// Download file
app.use('/download', require('./routes/download'));

// Public API
app.use('/public-api/crawl', require('./routes/crawl'));
app.use('/public-api/check', require('./routes/check'));

app.use('/public-api/auth', require('./routes/auth'));

app.use('/public-api/login', require('./routes/login'));
app.use('/public-api/register', require('./routes/register'));

app.use('/public-api', require('./routes/public'));

app.use('/public-api-auth',
    require('./middleware/auth-member.js'),
    require('./routes/public-auth'));

// Middeware check auth
var authCheckMiddleware = require('./middleware/auth-check.js');
app.use('/api', authCheckMiddleware);

var router = require('./routes');
app.use('/api', router);

app.get('/*', function(req, res) {
    var filePath = path.join(__dirname, 'build', 'index.html');
    res.sendFile(filePath);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {

    console.log('err', err);

    if (err) return res.json({ error: true, status: err.status, message: err.message });

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
