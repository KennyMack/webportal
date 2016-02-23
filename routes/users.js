var express         = require('express');
var router          = express.Router();
var auth            = require('../auth/auth');
var usersController = require('../controller/users-controller');
var utils = require('../utils/utils');

router.use(function (req, res, next) {
  return auth.ensureAuthenticated(req, res, next);
});


router.get('/test', function (req, res) {
  res.json({ hello: 'world'});
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
