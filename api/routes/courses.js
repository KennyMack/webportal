/**
 * Created by jonathan on 01/03/16.
 */
var express           = require('express');
var router            = express.Router();
var auth              = require('../auth/auth');
var coursesController = require('../controller/courses-controller');
var classController   = require('../controller/class-controller');
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
        name: req.body.name  || '',
        description: req.body.description  || '',
        active: req.body.active || '0',
        duration: duration,
        course_type: course_type
    };

    coursesController.validateNewCourse(course)
        .then(function (course) {
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
        })
        .fail(function(err){
            res.json({
                success: false,
                data: err
            });
        });
});


/* PUT update a Course */
router.put('/', function (req, res) {
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
        _id: req.body._id || '',
        identify: req.body.identify || '',
        name: req.body.name  || '',
        description: req.body.description  || '',
        active: req.body.active || '0',
        duration: duration,
        course_type: course_type
    };

    coursesController.validateUpdateCourse(course)
        .then(function (course) {
            return coursesController.updateCourse(course);
        })
        .then(function (course) {
            res.json({
                success: true,
                data: course
            });
        })
        .fail(function (err) {
            res.json({
                success: false,
                data: err
            });
        });

    /*coursesController.validateUpdateCourse(course)
        .then(function (course) {
            coursesController.updateCourse(course)
                .then(function (ret, rets) {
                    res.json({
                        success: true,
                        data: ret,
                        ret: rets
                    });
                }, function (err) {
                    res.json({
                        success: false,
                        data: err
                    });
                });
        })
        .fail(function(err){
            res.json({
                success: false,
                data: err
            });
        });*/
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

/* POST add a Course Subject. */
router.post('/:id/add-subject', function (req, res) {
    var subject = {
        _id: req.params.id  || '',
        teacher: req.body.teacher || '',
        subject: req.body.subject || ''
    };

    coursesController.addSubject(subject)
        .then(function (course) {
            res.json({
                success: true,
                data: course
            });
        })
        .fail(function (err) {
            res.json({
                success: false,
                data: err
            });
        });
});


/* DELETE remove a Course subject. */
router.delete('/:id/remove-subject/:idsubject', function (req, res) {
    var subject = {
        _id: req.params.id  || '',
        _idsubject: req.params.idsubject || ''
    };

    coursesController.removeSubject(subject)
        .then(function (course) {
            res.json({
                success: true,
                data: course
            });
        })
        .fail(function (err) {
            res.json({
                success: false,
                data: err
            });
        });
});

/* POST add a Course schedule. */
router.post('/:id/add-schedule', function (req, res) {
    var duration = {
        start: '',
        end: ''
    };

    duration.start = (req.body.duration && req.body.duration.start || '');
    duration.end = (req.body.duration && req.body.duration.end || '');

    var item = {
        _id: req.params.id  || '',
        day: req.body.day || '',
        subject: req.body.subject || '',
        duration: duration
    };


    coursesController.addSchedule(item)
        .then(function (course) {
            res.json({
                success: true,
                data: course
            });
        })
        .fail(function (err) {
            res.json({
                success: false,
                data: err
            });
        });
});

/* DELETE remove a Course schedule. */
router.delete('/:id/remove-schedule/:idschedule', function (req, res) {
    var item = {
        _id: req.params.id  || '',
        _idschedule: req.params.idschedule || ''
    };

    coursesController.removeSchedule(item)
        .then(function (course) {
            res.json({
                success: true,
                data: course
            });
        })
        .fail(function (err) {
            res.json({
                success: false,
                data: err
            });
        });
});

/* POST add a class. */
router.post('/:id/add-class', function (req, res) {
    var clas = {
        _id: req.params.id || '',
        class: []
    };

    clas.class = req.body.class || [];

    classController.createClass(clas)
        .then(function (course) {
            res.json({
                success: true,
                data: course
            });
        })
        .fail(function (err) {
            res.json({
                success: false,
                data: err
            });
        });
});

/* DELETE deactivate a student. */
router.delete('/:id/deactive-student/:idstudent', function (req, res) {
    var clas = {
        _id: req.params.id || '',
        _idstudent: req.params.idstudent || ''
    };


    classController.deactiveStudent(clas)
        .then(function (course) {
            res.json({
                success: true,
                data: course
            });
        })
        .fail(function (err) {
            res.json({
                success: false,
                data: err
            });
        });
});

/* DELETE deactivate a student. */
router.post('/:id/activate-student', function (req, res) {
    var clas = {
        _id: req.params.id || '',
        _idstudent: req.body._idstudent || ''
    };


    classController.activateStudent(clas)
        .then(function (course) {
            res.json({
                success: true,
                data: course
            });
        })
        .fail(function (err) {
            res.json({
                success: false,
                data: err
            });
        });
});



module.exports = router;