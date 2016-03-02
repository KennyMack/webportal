/**
 * Created by jonathan on 01/03/16.
 */
var express              = require('express');
var router               = express.Router();
var auth                 = require('../auth/auth');
var courseTypeController = require('../controller/course-type-controller');
var utils                = require('../utils/utils');

/* Middleware for authentication */
router.use(function (req, res, next) {
    return auth.ensureAuthenticated(req, res, next);
});

/* GET Course Type listing. */
router.get('/', function(req, res) {
    courseTypeController.listCoursesType()
      .then(function (coursesType) {
        res.json({
          success: true,
          data: coursesType
        });
      }, function(err){
        res.json({
          success: false,
          data: err
        });
      });

});

/* GET Course Type by ID. */
router.get('/:id', function (req, res) {
  var courseType = {
    _id: req.params.id  || ''
  };

  var errors = courseTypeController.validateCourseType(courseType, utils.OPERATION_STATUS.SELECT);

  if (Object.keys(errors).length !== 0) {
    res.json({
      success: false,
      data: errors
    });
  }
  else {
    courseTypeController.getById(courseType['_id'])
        .then(function (courseType) {
          if (courseType) {
            res.json({
              success: true,
              data: courseType
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

/* POST create a Course Type */
router.post('/', function (req, res) {
  var courseType = {
    description: req.body.description  || ''
  };

  var errors = courseTypeController.validateCourseType(courseType, utils.OPERATION_STATUS.NEW);

  if (Object.keys(errors).length !== 0) {
    res.json({
      success: false,
      data: errors
    });
  }
  else{
    courseTypeController.createCourseType(courseType)
        .then(function (courseType) {
          res.json({
            success: true,
            data: courseType
          });
        }, function (err) {
          res.json({
            success: false,
            data: err
          });
        });

  }
});


/* PUT update a Course Type */
router.put('/', function (req, res) {
  var courseType = {
      _id: req.body._id || '',
      description: req.body.description || ''
  };

  var errors = courseTypeController.validateCourseType(courseType, utils.OPERATION_STATUS.UPDATE);

  if (Object.keys(errors).length !== 0) {
    res.json({
      success: false,
      data: errors
    });
  }
  else{
    courseTypeController.updateCourseType(courseType)
        .then(function (courseType) {
          res.json({
            success: true,
            data: courseType
          });
        }, function (err) {
          res.json({
            success: false,
            data: err
          });
        });

  }
});


/* DELETE remove a Course Type by ID. */
router.delete('/:id', function (req, res) {
  var courseType = {
    _id: req.params.id  || ''
  };


  var errors = courseTypeController.validateCourseType(courseType, utils.OPERATION_STATUS.DELETE);

  if (Object.keys(errors).length !== 0) {
    res.json({
      success: false,
      data: errors
    });
  }
  else{
    courseTypeController.removeById(courseType['_id'])
        .then(function (courseType) {
          if (courseType) {
            res.json({
              success: true,
              data: courseType
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
  }
});

module.exports = router;