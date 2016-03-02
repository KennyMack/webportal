/**
 * Created by jonathan on 01/03/16.
 */
var express           = require('express');
var router            = express.Router();
var auth              = require('../auth/auth');
var coursesController = require('../controller/courses-controller');
var utils             = require('../utils/utils');

/* Middleware for authentication */
router.use(function (req, res, next) {
    return auth.ensureAuthenticated(req, res, next);
});

/* GET Course listing. */
router.get('/', function(req, res) {
    coursesController.listCourses()
        .then(function (courses) {
            res.json({
                success: true,
                data: courses
            });
        }, function(err){
            res.json({
                success: false,
                data: err
            });
        });

});

/* GET Course by ID. */
router.get('/:id', function (req, res) {
    var course = {
        _id: req.params.id  || ''
    };

    var errors = coursesController.validateCourse(course, utils.OPERATION_STATUS.SELECT);

    if (Object.keys(errors).length !== 0) {
        res.json({
            success: false,
            data: errors
        });
    }
    else {
        coursesController.getById(course['_id'])
            .then(function (course) {
                if (course) {
                    res.json({
                        success: true,
                        data: course
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

/* POST create a Course */
router.post('/', function (req, res) {
    var duration = {
        start: '',
        end: ''
    };

    var course_type = {
        _id:'',
        description: ''
    };

    course_type._id = (req.body.course_type && req.body.course_type._id || '');
    course_type.description = (req.body.course_type && req.body.course_type.description || '');
    duration.start = (req.body.duration && req.body.duration.start || '');
    duration.end = (req.body.duration && req.body.duration.end || '');


    var course = {
        identify: req.body.identify || '',
        description: req.body.description  || '',
        duration: duration,
        course_type: course_type
    };

    var errors = coursesController.validateCourse(course, utils.OPERATION_STATUS.NEW);

    if (Object.keys(errors).length !== 0) {
        res.json({
            success: false,
            data: errors
        });
    }
    else{
        coursesController.createCourse(course)
            .then(function (course) {
                res.json({
                    success: true,
                    data: course
                });
            }, function (err) {
                res.json({
                    success: false,
                    data: err
                });
            });
    }
});


/* PUT update a Course */
router.put('/', function (req, res) {
    var course = {
        _id: req.body._id || '',
        description: req.body.description || ''
    };

    var errors = coursesController.validateCourse(course, utils.OPERATION_STATUS.UPDATE);

    if (Object.keys(errors).length !== 0) {
        res.json({
            success: false,
            data: errors
        });
    }
    else{
        coursesController.updateCourse(course)
            .then(function (course) {
                res.json({
                    success: true,
                    data: course
                });
            }, function (err) {
                res.json({
                    success: false,
                    data: err
                });
            });

    }
});


/* DELETE remove a Course by ID. */
router.delete('/:id', function (req, res) {
    var course = {
        _id: req.params.id  || ''
    };


    var errors = coursesController.validateCourse(course, utils.OPERATION_STATUS.DELETE);

    if (Object.keys(errors).length !== 0) {
        res.json({
            success: false,
            data: errors
        });
    }
    else{
        coursesController.removeById(course['_id'])
            .then(function (course) {
                if (course) {
                    res.json({
                        success: true,
                        data: course
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