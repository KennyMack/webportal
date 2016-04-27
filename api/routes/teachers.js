/**
 * Created by jonathan on 03/03/16.
 */
'use strict';

module.exports = function (express, io) {

    const router = express.Router();
    const auth = require('../auth/auth');
    const teachersController = require('../controller/teachers-controller');
    const utils = require('../utils/utils');
    io.on('connection', function (socket) {
        console.log('Connection on Teachers');
        /*socket.on('big', function(){
         console.log('big');
         });
         socket.emit('get', { 'get':'Express' });*/
    });

    /* Middleware for authentication */
    router.use(function (req, res, next) {
        return auth.ensureAuthenticated(req, res, next);
    });

    /* GET Teacher listing. */
    router.get('/', function (req, res) {
        teachersController.listTeachers()
            .then(function (teachers) {
                res.json({
                    success: true,
                    data: teachers
                });
            }, function (err) {
                res.json({
                    success: false,
                    data: err
                });
            });

    });

    /* GET Teacher by ID. */
    router.get('/:id', function (req, res) {
        var teacher = {
            _id: req.params.id || ''
        };

        var errors = teachersController.validateTeacher(teacher, utils.OPERATION_STATUS.SELECT);

        if (Object.keys(errors).length !== 0) {
            res.json({
                success: false,
                data: errors
            });
        }
        else {
            teachersController.getById(teacher['_id'])
                .then(function (teacher) {
                    if (teacher) {
                        res.json({
                            success: true,
                            data: teacher
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

    /* POST create a Teacher */
    router.post('/', function (req, res) {
        var teacher = {
            identify: req.body.identify || '',
            name: req.body.name || '',
            gender: req.body.gender || '',
            dob: req.body.dob || '',
            active: req.body.active || '1',
            social_number: req.body.social_number || ''
        };

        var errors = teachersController.validateTeacher(teacher, utils.OPERATION_STATUS.NEW);

        if (Object.keys(errors).length !== 0) {
            res.json({
                success: false,
                data: errors
            });
        }
        else {
            teachersController.createTeacher(teacher)
                .then(function (teacher) {
                    res.json({
                        success: true,
                        data: teacher
                    });
                }, function (err) {
                    res.json({
                        success: false,
                        data: err
                    });
                });

        }
    });


    /* PUT update a Teacher */
    router.put('/', function (req, res) {
        var teacher = {
            _id: req.body._id || '',
            identify: req.body.identify || '',
            name: req.body.name || '',
            gender: req.body.gender || '',
            dob: req.body.dob || '',
            active: req.body.active || '1',
            social_number: req.body.social_number || ''
        };

        var errors = teachersController.validateTeacher(teacher, utils.OPERATION_STATUS.UPDATE);

        if (Object.keys(errors).length !== 0) {
            res.json({
                success: false,
                data: errors
            });
        }
        else {
            teachersController.updateTeacher(teacher)
                .then(function (teacher) {
                    res.json({
                        success: true,
                        data: teacher
                    });
                }, function (err) {
                    res.json({
                        success: false,
                        data: err
                    });
                });

        }
    });


    /* DELETE remove a Teacher by ID. */
    router.delete('/:id', function (req, res) {
        var teacher = {
            _id: req.params.id || ''
        };

        var errors = teachersController.validateTeacher(teacher, utils.OPERATION_STATUS.DELETE);

        if (Object.keys(errors).length !== 0) {
            res.json({
                success: false,
                data: errors
            });
        }
        else {
            teachersController.removeById(teacher['_id'])
                .then(function (teacher) {
                    if (teacher) {
                        res.json({
                            success: true,
                            data: teacher
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


    /* POST add a Subject. */
    router.post('/:id/add-subject', function (req, res) {
        var subject = {
            _id: req.params.id || '',
            _idsubject: req.body._idsubject || '',
            description: req.body.description || ''
        };

        teachersController.addSubject(subject)
            .then(function (teacher) {
                res.json({
                    success: true,
                    data: teacher
                });
            })
            .catch(function (err) {
                res.json({
                    success: false,
                    data: err
                });
            });
    });


    /* DELETE remove a subject. */
    router.delete('/:id/remove-subject/:idsubject', function (req, res) {
        var subject = {
            _id: req.params.id || '',
            _idsubject: req.params.idsubject || ''
        };

        teachersController.removeSubject(subject)
            .then(function (teacher) {
                res.json({
                    success: true,
                    data: teacher
                });
            })
            .catch(function (err) {
                res.json({
                    success: false,
                    data: err
                });
            });
    });

    /* POST add a schedule. */
    router.post('/:id/add-schedule', function (req, res) {
        var duration = {
            start: '',
            end: ''
        };

        duration.start = (req.body.duration && req.body.duration.start || '');
        duration.end = (req.body.duration && req.body.duration.end || '');

        var item = {
            _id: req.params.id || '',
            day: req.body.day || '',
            duration: duration
        };


        teachersController.addSchedule(item)
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

    /* DELETE remove a schedule. */
    router.delete('/:id/remove-schedule/:idschedule', function (req, res) {
        var item = {
            _id: req.params.id || '',
            _idschedule: req.params.idschedule || ''
        };

        teachersController.removeSchedule(item)
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

    return router;
};