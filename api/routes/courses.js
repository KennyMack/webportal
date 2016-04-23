/**
 * Created by jonathan on 01/03/16.
 */
'use strict';
module.exports = function (express, io) {

    const router            = express.Router();
    const auth              = require('../auth/auth');
    const coursesController = require('../controller/courses-controller');
    const classController   = require('../controller/class-controller');
    const utils             = require('../utils/utils');

    io.on('connection', function(socket){
        console.log('Connection on Courses');
        /*socket.on('big', function(){
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
        coursesController.listCourses()
            .then(function (courses) {
                res.json({
                    success: true,
                    data: courses
                });
            }, function (err) {
                res.json({
                    success: false,
                    data: err
                });
            });

    });

    /* GET Course by ID. */
    router.get('/:id', function (req, res) {
        let course = {
            _id: req.params.id || ''
        };

        coursesController.validateCourse(course, utils.OPERATION_STATUS.SELECT)
            .then(function (rcourse) {
                coursesController.getById(rcourse['_id'])
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
            })
            .catch(function (err) {
                res.json({
                    success: false,
                    data: err
                });
            });
    });

    /* POST create a Course */
    router.post('/', function (req, res) {
        let duration = {
            start: '',
            end: ''
        };

        let course_type = {
            _id: '',
            description: ''
        };

        course_type._id = (req.body.course_type && req.body.course_type._id || '');
        course_type.description = (req.body.course_type && req.body.course_type.description || '');
        duration.start = (req.body.duration && req.body.duration.start || '');
        duration.end = (req.body.duration && req.body.duration.end || '');


        let course = {
            identify: req.body.identify || '',
            name: req.body.name || '',
            description: req.body.description || '',
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
            .catch(function (err) {
                res.json({
                    success: false,
                    data: err
                });
            });
    });


    /* PUT update a Course */
    router.put('/', function (req, res) {
        let duration = {
            start: '',
            end: ''
        };

        let course_type = {
            _id: '',
            description: ''
        };

        course_type._id = (req.body.course_type && req.body.course_type._id || '');
        course_type.description = (req.body.course_type && req.body.course_type.description || '');
        duration.start = (req.body.duration && req.body.duration.start || '');
        duration.end = (req.body.duration && req.body.duration.end || '');


        var course = {
            _id: req.body._id || '',
            identify: req.body.identify || '',
            name: req.body.name || '',
            description: req.body.description || '',
            active: req.body.active || '0',
            duration: duration,
            course_type: course_type
        };

        coursesController.validateUpdateCourse(course)
            .then(function (course) {
                return coursesController.updateCourse(course);
            })
            .then(function (pcourse) {
                res.json({
                    success: true,
                    data: pcourse
                });
            })
            .catch(function (err) {
                res.json({
                    success: false,
                    data: err
                });
            });
    });


    /* DELETE remove a Course by ID. */
    router.delete('/:id', function (req, res) {
        let course = {
            _id: req.params.id || ''
        };

        coursesController.validateCourse(course, utils.OPERATION_STATUS.DELETE)
            .then(function (rcourse) {
                coursesController.removeById(rcourse['_id'])
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
            })
            .catch(function (err) {
                res.json({
                    success: false,
                    data: err
                });
            });
    });

    /* POST add a Course Subject. */
    router.post('/:id/add-subject', function (req, res) {
        let subject = {
            _id: req.params.id || '',
            teacher: req.body.teacher || '',
            subject: req.body.subject || '',
            schedule: []
        };

        coursesController.addSubject(subject)
            .then(function (course) {
                res.json({
                    success: true,
                    data: course
                });
            })
            .catch(function (err) {
                res.json({
                    success: false,
                    data: err
                });
            });
    });


    /* DELETE remove a Course subject. */
    router.delete('/:id/remove-subject/:idsubject', function (req, res) {
        let subject = {
            _id: req.params.id || '',
            _idsubject: req.params.idsubject || ''
        };

        coursesController.removeSubject(subject)
            .then(function (course) {
                res.json({
                    success: true,
                    data: course
                });
            })
            .catch(function (err) {
                res.json({
                    success: false,
                    data: err
                });
            });
    });

    /* POST add a Course schedule. */
    router.post('/:id/add-schedule', function (req, res) {
        let duration = {
            start: '',
            end: ''
        };

        duration.start = (req.body.duration && req.body.duration.start || '');
        duration.end = (req.body.duration && req.body.duration.end || '');

        let item = {
            _id: req.params.id || '',
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
            .catch(function (err) {
                if (err === 404) {
                    res.status(404).json({
                        success: false,
                        data: '404 - Not Found'
                    });
                }
                else {
                    res.json({
                        success: false,
                        data: err
                    });
                }
            });
    });

    /* DELETE remove a Course schedule. */
    router.delete('/:id/remove-schedule/:idsubject/item/:idschedule/', function (req, res) {
        let item = {
            _id: req.params.id || '',
            _idschedule: req.params.idschedule || '',
            _idsubject: req.params.idsubject || ''
        };

        coursesController.removeSchedule(item)
            .then(function (course) {
                res.json({
                    success: true,
                    data: course
                });
            })
            .catch(function (err) {
                res.json({
                    success: false,
                    data: err
                });
            });
    });

    /* POST add a class. */
    router.post('/:id/add-class', function (req, res) {
        let clas = {
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
        let clas = {
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
        let clas = {
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

    router.get('/:id/subjects', function (req, res) {
        let course = {
            _id: req.params.id || ''
        };

        coursesController.validateCourse(course, utils.OPERATION_STATUS.SELECT)
            .then(function (rcourse) {
                coursesController.getCourseSubjects(rcourse['_id'])
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
            })
            .catch(function (err) {
                res.json({
                    success: false,
                    data: err
                });
            });
    });


    return router;
};
