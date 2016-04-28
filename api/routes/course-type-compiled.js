/**
 * Created by jonathan on 01/03/16.
 */
'use strict';

module.exports = function (express, io) {
  var courseTypeController = require('../controller/course-type-controller');
  var router = express.Router();
  var auth = require('../auth/auth');
  var utils = require('../utils/utils');

  io.on('connection', function (socket) {
    console.log('Connection on Course-Type');
    /*socket.on('big', () => {
     console.log('big');
     });
     socket.emit('get', { 'get':'Express' });*/
  });

  /* Middleware for authentication */
  router.use(function (req, res, next) {
    return auth.ensureAuthenticated(req, res, next);
  });

  /* GET Course Type listing. */
  router.get('/', function (req, res) {
    courseTypeController.listCoursesType().then(function (coursesType) {
      res.json({
        success: true,
        data: coursesType
      });
    }).catch(function (err) {
      res.json({
        success: false,
        data: err
      });
    });
  });

  /* GET Course Type by ID. */
  router.get('/:id', function (req, res) {
    var courseType = {
      _id: req.params.id || ''
    };

    validateCourseType(courseType, utils.OPERATION_STATUS.SELECT).then(function (coursetype) {
      return courseTypeController.getById(coursetype['_id']);
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

  /* POST create a Course Type */
  router.post('/', function (req, res) {
    var courseType = {
      description: req.body.description || ''
    };

    courseTypeController.validateCourseType(courseType, utils.OPERATION_STATUS.NEW).then(courseTypeController.createCourseType).then(function (result) {
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

  /* PUT update a Course Type */
  router.put('/', function (req, res) {
    var courseType = {
      _id: req.body._id || '',
      description: req.body.description || ''
    };

    courseTypeController.validateCourseType(courseType, utils.OPERATION_STATUS.UPDATE).then(courseTypeController.updateCourseType).then(function (result) {
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

  /* DELETE remove a Course Type by ID. */
  router.delete('/:id', function (req, res) {
    var courseType = {
      _id: req.params.id || ''
    };

    validateCourseType(courseType, utils.OPERATION_STATUS.DELETE).then(function (coursetype) {
      return courseTypeController.removeById(coursetype['_id']);
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

  return router;
};

//# sourceMappingURL=course-type-compiled.js.map