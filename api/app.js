var express    = require('express');
var path       = require('path');
//var favicon    = require('serve-favicon');
var logger     = require('morgan');
var bodyParser = require('body-parser');
var config     = require('./config/config.js');

// Routers
var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');

// App
var app = express();

// Globals
app.set('secretKey', config['secretKey']);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to headers
app.use(function (req, res, next) {
  console.log('middleware');
  res.header('Access-Control-Allow-Origin', '127.0.0.1:5000, 127.0.0.1:63342');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header("Content-Type", "application/json; charset=utf-8");
  req.token = req.headers['x-access-token'] || req.body.token || req.params.token;
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/mordor', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
