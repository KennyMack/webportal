/**
 * Created by jonathan on 01/03/16.
 */
'use strict';

module.exports = function (express, io) {

    var router = express.Router();
    var auth = require('../auth/auth');
    var coursesController = require('../controller/courses-controller');
    var classController = require('../controller/class-controller');
    var utils = require('../utils/utils');

    io.on('connection', function (socket) {
        console.log('Connection on Courses');
        /*socket.on('big', ()=> {
         console.log('big');
         });
         socket.emit('get', { 'get':'Express' });*/
    });

    /* Middleware for authentication */
    router.use(function (req, res, next) {
        return auth.ensureAuthenticated(req, res, next);
    });

    /* GET Course listing. */
    router.get('/', function (req, res) {
        coursesController.listCourses().then(function (courses) {
            res.json({
                success: true,
                data: courses
            });
        }).catch(function (err) {
            res.json({
                success: false,
                data: err
            });
        });
    });

    /* GET Course by ID. */
    router.get('/:id', function (req, res) {
        var course = {
            _id: req.params.id || ''
        };

        coursesController.validateCourse(course, utils.OPERATION_STATUS.SELECT).then(function (rcourse) {
            return coursesController.getById(rcourse['_id']);
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

    /* POST create a Course */
    router.post('/', function (req, res) {
        var duration = {
            start: '',
            end: ''
        };

        var course_type = {
            _id: '',
            description: ''
        };

        course_type._id = req.body.course_type && req.body.course_type._id || '';
        course_type.description = req.body.course_type && req.body.course_type.description || '';
        duration.start = req.body.duration && req.body.duration.start || '';
        duration.end = req.body.duration && req.body.duration.end || '';

        var course = {
            identify: req.body.identify || '',
            name: req.body.name || '',
            description: req.body.description || '',
            active: req.body.active || '0',
            duration: duration,
            course_type: course_type
        };

        coursesController.validateNewCourse(course).then(coursesController.createCourse).then(function (result) {
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

    /* PUT update a Course */
    router.put('/', function (req, res) {
        var duration = {
            start: '',
            end: ''
        };

        var course_type = {
            _id: '',
            description: ''
        };

        course_type._id = req.body.course_type && req.body.course_type._id || '';
        course_type.description = req.body.course_type && req.body.course_type.description || '';
        duration.start = req.body.duration && req.body.duration.start || '';
        duration.end = req.body.duration && req.body.duration.end || '';

        var course = {
            _id: req.body._id || '',
            identify: req.body.identify || '',
            name: req.body.name || '',
            description: req.body.description || '',
            active: req.body.active || '0',
            duration: duration,
            course_type: course_type
        };

        coursesController.validateUpdateCourse(course).then(coursesController.updateCourse).then(function (result) {
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

    /* DELETE remove a Course by ID. */
    router.delete('/:id', function (req, res) {
        var course = {
            _id: req.params.id || ''
        };

        coursesController.validateCourse(course, utils.OPERATION_STATUS.DELETE).then(function (rcourse) {
            return coursesController.removeById(rcourse['_id']);
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

    /* POST add a Course Subject. */
    router.post('/:id/add-subject', function (req, res) {
        var subject = {
            _id: req.params.id || '',
            teacher: req.body.teacher || '',
            subject: req.body.subject || '',
            schedule: []
        };

        coursesController.addSubject(subject).then(function (course) {
            res.json({
                success: true,
                data: course
            });
        }).catch(function (err) {
            res.json({
                success: false,
                data: err
            });
        });
    });

    /* DELETE remove a Course subject. */
    router.delete('/:id/remove-subject/:idsubject', function (req, res) {
        var subject = {
            _id: req.params.id || '',
            _idsubject: req.params.idsubject || ''
        };

        coursesController.removeSubject(subject).then(function (course) {
            res.json({
                success: true,
                data: course
            });
        }).catch(function (err) {
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

        duration.start = req.body.duration && req.body.duration.start || '';
        duration.end = req.body.duration && req.body.duration.end || '';

        var item = {
            _id: req.params.id || '',
            day: req.body.day || '',
            subject: req.body.subject || '',
            duration: duration
        };

        coursesController.addSchedule(item).then(function (course) {
            res.json({
                success: true,
                data: course
            });
        }).catch(function (err) {
            if (err === 404) {
                res.status(404).json({
                    success: false,
                    data: '404 - Not Found'
                });
            } else {
                res.json({
                    success: false,
                    data: err
                });
            }
        });
    });

    /* DELETE remove a Course schedule. */
    router.delete('/:id/remove-schedule/:idsubject/item/:idschedule/', function (req, res) {
        var item = {
            _id: req.params.id || '',
            _idschedule: req.params.idschedule || '',
            _idsubject: req.params.idsubject || ''
        };

        coursesController.removeSchedule(item).then(function (course) {
            res.json({
                success: true,
                data: course
            });
        }).catch(function (err) {
            res.json({
                success: false,
                data: err
            });
        });
    });

    /* POST add a class. */
    router.post('/:id/add-class', function (req, res) {
        var roomClass = {
            _id: req.params.id || '',
            class: []
        };

        roomClass.class = req.body.class || [];

        classController.createClass(roomClass).then(function (course) {
            res.json({
                success: true,
                data: course
            });
        }).fail(function (err) {
            res.json({
                success: false,
                data: err
            });
        });
    });

    /* DELETE deactivate a student. */
    router.delete('/:id/deactive-student/:idstudent', function (req, res) {
        var roomClass = {
            _id: req.params.id || '',
            _idstudent: req.params.idstudent || ''
        };

        classController.deactiveStudent(roomClass).then(function (course) {
            res.json({
                success: true,
                data: course
            });
        }).fail(function (err) {
            res.json({
                success: false,
                data: err
            });
        });
    });

    /* DELETE deactivate a student. */
    router.post('/:id/activate-student', function (req, res) {
        var roomClass = {
            _id: req.params.id || '',
            _idstudent: req.body._idstudent || ''
        };

        classController.activateStudent(roomClass).then(function (course) {
            res.json({
                success: true,
                data: course
            });
        }).fail(function (err) {
            res.json({
                success: false,
                data: err
            });
        });
    });

    router.get('/:id/subjects', function (req, res) {
        var course = {
            _id: req.params.id || ''
        };

        coursesController.validateCourse(course, utils.OPERATION_STATUS.SELECT).then(function (rcourse) {
            return coursesController.getCourseSubjects(rcourse['_id']);
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

//# sourceMappingURL=courses-compiled.js.map