/**
 * Created by jonathan on 01/03/16.
 */
'use strict';
module.exports =  (express, io) => {

    const router            = express.Router();
    const auth              = require('../auth/auth');
    const coursesController = require('../controller/courses-controller');
    const classController   = require('../controller/class-controller');
    const utils             = require('../utils/utils');

    io.on('connection', (socket) => {
        console.log('Connection on Courses');
        /*socket.on('big', ()=> {
         console.log('big');
         });
         socket.emit('get', { 'get':'Express' });*/
    });

    /* Middleware for authentication */
    router.use( (req, res, next) => {
        return auth.ensureAuthenticated(req, res, next);
    });

    /* GET Course listing. */
    router.get('/',  (req, res) => {
        coursesController.listCourses()
            .then( (courses) => {
                res.json({
                    success: true,
                    data: courses
                });
            })
            .catch( (err) => {
                res.json({
                    success: false,
                    data: err
                });
            });

    });

    /* GET Course by ID. */
    router.get('/:id',  (req, res) => {
        let course = {
            _id: req.params.id || ''
        };

        coursesController.validateCourse(course, utils.OPERATION_STATUS.SELECT)
            .then( (rcourse) => {
                return coursesController.getById(rcourse['_id']);
            })
            .then( (result) => {
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
            .catch( (err) => {
                res.json({
                    success: false,
                    data: err
                });
            });
    });

    /* POST create a Course */
    router.post('/',  (req, res) => {
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
            .then(coursesController.createCourse)
            .then( (result) => {
                res.json({
                    success: true,
                    data: result
                });
            })
            .catch( (err) => {
                res.json({
                    success: false,
                    data: err
                });
            });
    });


    /* PUT update a Course */
    router.put('/',  (req, res) => {
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
            .then(coursesController.updateCourse)
            .then( (result) => {
                res.json({
                    success: true,
                    data: result
                });
            })
            .catch( (err) => {
                res.json({
                    success: false,
                    data: err
                });
            });
    });


    /* DELETE remove a Course by ID. */
    router.delete('/:id',  (req, res) => {
        let course = {
            _id: req.params.id || ''
        };

        coursesController.validateCourse(course, utils.OPERATION_STATUS.DELETE)
            .then( (rcourse) => {
                return coursesController.removeById(rcourse['_id'])
            })
            .then( (result) => {
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
            .catch( (err) => {
                res.json({
                    success: false,
                    data: err
                });
            });
    });

    /* POST add a Course Subject. */
    router.post('/:id/add-subject',  (req, res) => {
        let subject = {
            _id: req.params.id || '',
            teacher: req.body.teacher || '',
            subject: req.body.subject || '',
            schedule: []
        };

        coursesController.addSubject(subject)
            .then( (course) => {
                res.json({
                    success: true,
                    data: course
                });
            })
            .catch( (err) => {
                res.json({
                    success: false,
                    data: err
                });
            });
    });


    /* DELETE remove a Course subject. */
    router.delete('/:id/remove-subject/:idsubject',  (req, res) => {
        let subject = {
            _id: req.params.id || '',
            _idsubject: req.params.idsubject || ''
        };

        coursesController.removeSubject(subject)
            .then( (course) => {
                res.json({
                    success: true,
                    data: course
                });
            })
            .catch( (err) => {
                res.json({
                    success: false,
                    data: err
                });
            });
    });

    /* POST add a Course schedule. */
    router.post('/:id/add-schedule',  (req, res) => {
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
            .then( (course) => {
                res.json({
                    success: true,
                    data: course
                });
            })
            .catch( (err) => {
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
    router.delete('/:id/remove-schedule/:idsubject/item/:idschedule/',  (req, res) => {
        let item = {
            _id: req.params.id || '',
            _idschedule: req.params.idschedule || '',
            _idsubject: req.params.idsubject || ''
        };

        coursesController.removeSchedule(item)
            .then( (course) => {
                res.json({
                    success: true,
                    data: course
                });
            })
            .catch( (err) => {
                res.json({
                    success: false,
                    data: err
                });
            });
    });

    /* POST add a class. */
    router.post('/:id/add-class',  (req, res) => {
        let roomClass = {
            _id: req.params.id || '',
            class: []
        };

        roomClass.class = req.body.class || [];

        classController.createClass(roomClass)
            .then( (course) => {
                res.json({
                    success: true,
                    data: course
                });
            })
            .fail( (err) => {
                res.json({
                    success: false,
                    data: err
                });
            });
    });

    /* DELETE deactivate a student. */
    router.delete('/:id/deactive-student/:idstudent',  (req, res) => {
        let roomClass = {
            _id: req.params.id || '',
            _idstudent: req.params.idstudent || ''
        };


        classController.deactiveStudent(roomClass)
            .then( (course) => {
                res.json({
                    success: true,
                    data: course
                });
            })
            .fail( (err) => {
                res.json({
                    success: false,
                    data: err
                });
            });
    });

    /* DELETE deactivate a student. */
    router.post('/:id/activate-student',  (req, res) => {
        let roomClass = {
            _id: req.params.id || '',
            _idstudent: req.body._idstudent || ''
        };


        classController.activateStudent(roomClass)
            .then( (course) => {
                res.json({
                    success: true,
                    data: course
                });
            })
            .fail( (err) => {
                res.json({
                    success: false,
                    data: err
                });
            });
    });

    router.get('/:id/subjects',  (req, res) => {
        let course = {
            _id: req.params.id || ''
        };

        coursesController.validateCourse(course, utils.OPERATION_STATUS.SELECT)
            .then( (rcourse) => {
                return coursesController.getCourseSubjects(rcourse['_id'])
            })
            .then( (result) => {
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
            .catch( (err) => {
                res.json({
                    success: false,
                    data: err
                });
            });
    });


    return router;
};
