'use strict';

module.exports = function (express, io) {

  var router = express.Router();
  var auth = require('../auth/auth');
  var usersController = require('../controller/users-controller');
  var utils = require('../utils/utils');

  io.on('connection', function (socket) {
    console.log('Connection on User');
    /*socket.on('big', ()=> {
      console.log('big');
    });
    socket.emit('get', { 'get':'Express' });*/
  });

  /* GET users listing. */
  router.get('/', auth.ensureAuthenticated, function (req, res) {
    usersController.listUsers().then(function (users) {
      res.json({
        success: true,
        data: users
      });
    }).catch(function (err) {
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

    usersController.validateUser(user, utils.OPERATION_STATUS.SELECT).then(function (ruser) {
      return usersController.getUserById(ruser['_id']);
    }).then(function (result) {
      if (result) {
        res.json({
          success: true,
          data: result
        });
      } else {
        res.status(404).json({
          success: false,
          data: '404 - Not Found'
        });
      }
    }).catch(function (err) {
      res.json({
        success: false,
        data: err
      });
    });
  });

  /* GET user by ID. */
  router.get('/view/:id', auth.ensureAuthenticated, function (req, res) {
    var user = {
      _id: req.params.id || ''
    };

    usersController.validateUser(user, utils.OPERATION_STATUS.SELECT).then(function (ruser) {
      return usersController.getUserById(ruser['_id']);
    }).then(function (result) {
      if (result) {
        var usr = {
          _id: result._id,
          email: result.email,
          username: result.username,
          last_login: result.last_login,
          persons: result.persons
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
    }).catch(function (err) {
      res.json({
        success: false,
        data: err
      });
    });
  });

  /* GET user by ID. */
  router.get('/all-path/:id', auth.ensureAuthenticated, function (req, res) {
    var user = {
      _id: req.params.id || ''
    };

    usersController.validateUser(user, utils.OPERATION_STATUS.SELECT).then(function (ruser) {
      return usersController.getUserByIdAllPath(ruser['_id']);
    }).then(function (result) {
      if (result) {
        res.json({
          success: true,
          data: result
        });
      } else {
        res.status(404).json({
          success: false,
          data: '404 - Not Found'
        });
      }
    }).catch(function (err) {
      res.json({
        success: false,
        data: err
      });
    });
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

    usersController.validateUser(user, utils.OPERATION_STATUS.NEW).then(usersController.createUser).then(function (result) {
      res.json({
        success: true,
        data: result
      });
    }).catch(function (err) {
      res.json({
        success: false,
        data: err
      });
    });
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

    usersController.validateUser(user, utils.OPERATION_STATUS.NEW).then(usersController.updateUser).then(function (result) {
      res.json({
        success: true,
        data: result
      });
    }).catch(function (err) {
      res.json({
        success: false,
        data: err
      });
    });
  });

  /* DELETE remove a user by ID. */
  router.delete('/:id', auth.ensureAuthenticated, function (req, res) {
    var user = {
      _id: req.params.id || ''
    };

    usersController.validateUser(user, utils.OPERATION_STATUS.DELETE).then(function (ruser) {
      return usersController.removeById(ruser['_id']);
    }).then(function (result) {
      if (result) {
        res.json({
          success: true,
          data: result
        });
      } else {
        res.status(404).json({
          success: false,
          data: '404 - Not Found'
        });
      }
    }).catch(function (err) {
      res.json({
        success: false,
        data: err
      });
    });
  });

  /* POST add a person to User */
  router.post('/add-person', auth.ensureAuthenticated, function (req, res) {
    var user = {
      _id: req.body._id || '',
      idparent: req.body.idparent || '',
      type: req.body.type || ''
    };

    usersController.setLoginPerson(user).then(function (user) {
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
    }).catch(function (err) {
      res.json({
        success: false,
        data: err
      });
    });
  });

  return router;
};

//# sourceMappingURL=users-compiled.js.map