'use strict';

module.exports =  (express, io) => {

  const router = express.Router();
  const auth = require('../auth/auth');
  const usersController = require('../controller/users-controller');
  const utils = require('../utils/utils');

  io.on('connection', (socket)=> {
    console.log('Connection on User');
    /*socket.on('big', ()=> {
      console.log('big');
    });
    socket.emit('get', { 'get':'Express' });*/
  });


  /* GET users listing. */
  router.get('/', auth.ensureAuthenticated,  (req, res) => {
    usersController.listUsers()
        .then((users) => {
          res.json({
            success: true,
            data: users
          });
        })
        .catch((err) => {
          res.json({
            success: false,
            data: err
          });
        });

  });

  /* GET user by ID. */
  router.get('/:id', auth.ensureAuthenticated,  (req, res) => {
    let user = {
      _id: req.params.id || ''
    };

    usersController.validateUser(user, utils.OPERATION_STATUS.SELECT)
        .then((ruser) => {
            return usersController.getUserById(ruser['_id']);
        })
        .then((result) => {
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
        })
        .catch((err) => {
          res.json({
            success: false,
            data: err
          });
        });
  });

  /* GET user by ID. */
  router.get('/view/:id', auth.ensureAuthenticated,  (req, res) => {
    let user = {
      _id: req.params.id || ''
    };

    usersController.validateUser(user, utils.OPERATION_STATUS.SELECT)
        .then((ruser) => {
            return usersController.getUserById(ruser['_id']);
        })
        .then((result) => {
            if (result) {
                let usr = {
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
        })
        .catch((err) => {
            res.json({
              success: false,
              data: err
            });
        });

  });


  /* GET user by ID. */
  router.get('/all-path/:id', auth.ensureAuthenticated,  (req, res) => {
    let user = {
      _id: req.params.id || ''
    };

    usersController.validateUser(user, utils.OPERATION_STATUS.SELECT)
        .then((ruser) => {
            return usersController.getUserByIdAllPath(ruser['_id']);
        })
        .then((result) => {
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
        })
        .catch((err) => {
            res.json({
              success: false,
              data: err
            });
        });
  });

  /* POST create a new user */
  router.post('/',  (req, res) => {
    let user = {
      email: req.body.email || '',
      username: req.body.username || '',
      password: req.body.password || '',
      passwordbis: req.body.passwordbis || '',
      active: req.body.active || '1'
    };

    usersController.validateUser(user, utils.OPERATION_STATUS.NEW)
        .then(usersController.createUser)
        .then((result) => {
            res.json({
              success: true,
              data: result
            });
        })
        .catch((err) => {
            res.json({
              success: false,
              data: err
            });
        });
  });


  /* PUT update a user */
  router.put('/', auth.ensureAuthenticated,  (req, res) => {
    let user = {
      _id: req.body._id || '',
      email: req.body.email || '',
      username: req.body.username || '',
      password: req.body.password || '',
      passwordbis: req.body.passwordbis || '',
      active: req.body.active || ''
    };

    usersController.validateUser(user, utils.OPERATION_STATUS.NEW)
        .then(usersController.updateUser)
        .then((result) => {
            res.json({
              success: true,
              data: result
            });
        })
        .catch((err) => {
            res.json({
              success: false,
              data: err
            });
        });
  });


  /* DELETE remove a user by ID. */
  router.delete('/:id', auth.ensureAuthenticated,  (req, res) => {
    let user = {
      _id: req.params.id || ''
    };

    usersController.validateUser(user, utils.OPERATION_STATUS.DELETE)
        .then((ruser) => {
          return usersController.removeById(ruser['_id']);
        })
        .then((result) => {
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
        })
        .catch((err) => {
          res.json({
            success: false,
            data: err
          });
        });
  });

  /* POST add a person to User */
  router.post('/add-person', auth.ensureAuthenticated,  (req, res) => {
    let user = {
      _id: req.body._id || '',
      idparent: req.body.idparent || '',
      type: req.body.type || ''
    };

    usersController.setLoginPerson(user)
        .then( (user) => {
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
        .catch((err) => {
          res.json({
            success: false,
            data: err
          });
        });

  });

  return router;

};