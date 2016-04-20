'use strict';

const express    = require('express');
const path       = require('path');
const logger     = require('morgan');
const bodyParser = require('body-parser');
const config     = require('./config/config.js');
const socket_io  = require( "socket.io" );

// App
const app = express();

// Socket.io
const io         = socket_io();
app.io           = io;

// Globals
app.set('secretKey', config['secretKey']);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middleware to Uncaught Exceptions
app.use(function (req, res, next) {
  //console.log('domain');
  let domain = require('domain').create();

  domain.on('error', function (err) {
    //console.error('DOMAIN ERROR CAUGHT\n', err.stack);
    try {
      setTimeout(function () {
        //console.error('Failsafe shutdown');
        process.exit(1);
      }, 5000);

      let worker = require('cluster').worker;
      if (worker)
        worker.disconect();

      server.close();

      try {
        next(err);
      }
      catch(err) {
       // console.error('Express error mechanism failed.\n', err.stack);
        res.statusCode = 500;
        res.setHeader('content-type', 'application/json');
        res.end({
          message: 'Server Error.',
          error: {}
        })
      }
    }
    catch (err){
      //console.error('Unable to send 500 response.\n', err.stack);
    }
  });

  domain.add(req);
  domain.add(res);

  domain.run(next);

});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));



// Middleware to headers
app.use(function (req, res, next) {

  io.emit('hello', {hello: 'world'});
  //console.log('middleware');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header("Content-Type", "application/json; charset=utf-8");
  //TODO: Verify requests
  //if (req.body instanceof JSON){//Object.keys(req.body).length !== 0) {
  //  console.log('body');
  //  if (validator.isJSON(JSON.parse(req.body.toString())))
  //    console.log('json ok');
  //  else
  //    console.log('Erro json');
  //
  //}
  next();
});

// Routers
const routes     = require('./routes/index')(express, io);
const users      = require('./routes/users')(express, io);
const auth       = require('./routes/auth')(express, io);
const courseType = require('./routes/course-type')(express, io);
const courses    = require('./routes/courses')(express, io);
const teachers   = require('./routes/teachers')(express, io);
const subjects   = require('./routes/subjects')(express, io);
const students   = require('./routes/students')(express, io);
const testapp    = require('./routes/testapp')(express, io);


app.use('/', routes);
app.use('/users', users);
app.use('/mordor', auth);
app.use('/course-type', courseType);
app.use('/courses', courses);
app.use('/teachers', teachers);
app.use('/subjects', subjects);
app.use('/students', students);
app.use('/test', testapp);

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
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

io.on("connection", function(socket){
  //console.log('New connection found.');

  /*socket.on('loko', function (data) {
    console.log(data);
    socket.broadcast.emit('loko', data);
  })*/
});


module.exports = app;
