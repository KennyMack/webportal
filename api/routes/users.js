var express         = require('express');
var router          = express.Router();
var auth            = require('../auth/auth');
var usersController = require('./users-controller');
var utils           = require('../utils/utils');

/* Middleware for authentication */
router.use(function (req, res, next) {
  return auth.ensureAuthenticated(req, res, next);
});


/* GET users listing. */
router.get('/', function(req, res) {
    usersController.listUsers()
      .then(function (users) {
        res.json({
          success: true,
          data: users
        });
      }, function(err){
        res.json({
          success: false,
          data: err
        });
      });

});

/* GET user by ID. */
router.get('/:id', function (req, res) {
    usersController.getUserById(req.params.id)
      .then(function (user) {
        if (user) {
          res.json({
            success: true,
            data: user
          });
        } else {
          res.status(404).json({
            success: false,
            data: '404 - Not Found'
          });
        }
      }, function(err){
        res.json({
          success: false,
          data: err
        });
      });
});

/* POST create a new user */
router.post('/', function (req, res) {
  var user = {
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
    passwordbis: req.body.passwordbis
  };

  var errors = usersController.validateUser(user, utils.OPERATION_STATUS.NEW);

  if (Object.keys(errors).length !== 0) {
    res.json({
      success: false,
      data: errors
    });
  }
  else{
    usersController.createUser(user)
        .then(function (user) {
          res.json({
            success: true,
            data: user
          });
        }, function (err) {
          res.json({
            success: false,
            data: err
          });
        });

  }
});


/* PUT update a user */
router.put('/', function (req, res) {
  var user = {
    _id: req.body._id,
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
    passwordbis: req.body.passwordbis
  };

  var errors = usersController.validateUser(user, utils.OPERATION_STATUS.UPDATE);

  if (Object.keys(errors).length !== 0) {
    res.json({
      success: false,
      data: errors
    });
  }
  else{
    usersController.updateUser(user)
        .then(function (user) {
          res.json({
            success: true,
            data: user
          });
        }, function (err) {
          res.json({
            success: false,
            data: err
          });
        });

  }
});


/* DELETE remove a user by ID. */
router.delete('/:id', function (req, res) {
    usersController.removeById(req.params.id)
      .then(function (user) {
        if (user) {
          res.json({
            success: true,
            data: user
          });
        } else {
          res.status(404).json({
            success: false,
            data: '404 - Not Found'
          });
        }
      }, function(err){
        res.json({
          success: false,
          data: err
        });
      });
});

module.exports = router;
