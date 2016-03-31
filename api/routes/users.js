module.exports = function (express, io) {

  var router = express.Router();
  var auth = require('../auth/auth');
  var usersController = require('../controller/users-controller');
  var utils = require('../utils/utils');

  io.on('connection', function(socket){
    console.log('Connection on User');
    /*socket.on('big', function(){
      console.log('big');
    });
    socket.emit('get', { 'get':'Express' });*/
  });


  /* GET users listing. */
  router.get('/', auth.ensureAuthenticated, function (req, res) {
    usersController.listUsers()
        .then(function (users) {
          res.json({
            success: true,
            data: users
          });
        }, function (err) {
          res.json({
            success: false,
            data: err
          });
        });

  });

  /* GET user by ID. */
  router.get('/:id', auth.ensureAuthenticated, function (req, res) {
    var user = {
      _id: req.params.id || ''
    };

    var errors = usersController.validateUser(user, utils.OPERATION_STATUS.SELECT);

    if (Object.keys(errors).length !== 0) {
      res.json({
        success: false,
        data: errors
      });
    }
    else {
      usersController.getUserById(user['_id'])
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
          }, function (err) {
            res.json({
              success: false,
              data: err
            });
          });
    }
  });

  /* GET user by ID. */
  router.get('/view/:id', auth.ensureAuthenticated, function (req, res) {
    var user = {
      _id: req.params.id || ''
    };

    var errors = usersController.validateUser(user, utils.OPERATION_STATUS.SELECT);

    if (Object.keys(errors).length !== 0) {
      res.json({
        success: false,
        data: errors
      });
    }
    else {
      usersController.getUserById(user['_id'])
          .then(function (user) {
            if (user) {
              var usr = {
                _id: user._id,
                email: user.email,
                username: user.username,
                last_login: user.last_login,
                persons: user.persons
              };

              res.json({
                success: true,
                data: usr
              });
            } else {
              res.status(404).json({
                success: false,
                data: '404 - Not Found'
              });
            }
          }, function (err) {
            res.json({
              success: false,
              data: err
            });
          });
    }
  });


  /* GET user by ID. */
  router.get('/all-path/:id', auth.ensureAuthenticated, function (req, res) {
    var user = {
      _id: req.params.id || ''
    };

    var errors = usersController.validateUser(user, utils.OPERATION_STATUS.SELECT);

    if (Object.keys(errors).length !== 0) {
      res.json({
        success: false,
        data: errors
      });
    }
    else {
      usersController.getUserByIdAllPath(user['_id'])
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
          }, function (err) {
            res.json({
              success: false,
              data: err
            });
          });
    }
  });

  /* POST create a new user */
  router.post('/', function (req, res) {
    var user = {
      email: req.body.email || '',
      username: req.body.username || '',
      password: req.body.password || '',
      passwordbis: req.body.passwordbis || '',
      active: req.body.active || '1'
    };

    var errors = usersController.validateUser(user, utils.OPERATION_STATUS.NEW);

    if (Object.keys(errors).length !== 0) {
      res.json({
        success: false,
        data: errors
      });
    }
    else {
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
  router.put('/', auth.ensureAuthenticated, function (req, res) {
    var user = {
      _id: req.body._id || '',
      email: req.body.email || '',
      username: req.body.username || '',
      password: req.body.password || '',
      passwordbis: req.body.passwordbis || '',
      active: req.body.active || ''
    };

    var errors = usersController.validateUser(user, utils.OPERATION_STATUS.UPDATE);

    if (Object.keys(errors).length !== 0) {
      res.json({
        success: false,
        data: errors
      });
    }
    else {
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
  router.delete('/:id', auth.ensureAuthenticated, function (req, res) {
    var user = {
      _id: req.params.id || ''
    };

    var errors = usersController.validateUser(user, utils.OPERATION_STATUS.DELETE);

    if (Object.keys(errors).length !== 0) {
      res.json({
        success: false,
        data: errors
      });
    }
    else {
      usersController.removeById(user['_id'])
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
          }, function (err) {
            res.json({
              success: false,
              data: err
            });
          });
    }
  });

  /* POST add a person to User */
  router.post('/add-person', auth.ensureAuthenticated, function (req, res) {
    var user = {
      _id: req.body._id || '',
      idparent: req.body.idparent || '',
      type: req.body.type || ''
    };

    usersController.setLoginPerson(user)
        .then(function (user) {
          if (user) {
            res.json({
              success: true,
              data: "Login vinculado com sucesso."
            });
          } else {
            res.status(404).json({
              success: false,
              data: '404 - Not Found'
            });
          }
        })
        .fail(function (err) {
          res.json({
            success: false,
            data: err
          });
        });

  });

  return router;

};