/**
 * Created by jonathan on 03/03/16.
 */
'use strict';

module.exports = function (express, io) {

    var router = express.Router();
    var auth = require('../auth/auth');
    var teachersController = require('../controller/teachers-controller');
    var utils = require('../utils/utils');

    io.on('connection', function (socket) {
        console.log('Connection on Teachers');
        /*socket.on('big', ()=> {
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
        teachersController.listTeachers().then(function (teachers) {
            res.json({
                success: true,
                data: teachers
            });
        }).catch(function (err) {
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

        teachersController.validateTeacher(teacher, utils.OPERATION_STATUS.SELECT).then(function (item) {
            return teachersController.getById(item['_id']);
        }).then(function (teacher) {
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
        }).catch(function (err) {
            res.json({
                success: false,
                data: err
            });
        });
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

        teachersController.validateTeacher(teacher, utils.OPERATION_STATUS.NEW).then(teachersController.createTeacher).then(function (result) {
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

        teachersController.validateTeacher(teacher, utils.OPERATION_STATUS.UPDATE).then(teachersController.updateTeacher).then(function (result) {
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

    /* DELETE remove a Teacher by ID. */
    router.delete('/:id', function (req, res) {
        var teacher = {
            _id: req.params.id || ''
        };

        teachersController.validateTeacher(teacher, utils.OPERATION_STATUS.DELETE).then(function (pteacher) {
            return teachersController.removeById(pteacher['_id']);
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

    /* POST add a Subject. */
    router.post('/:id/add-subject', function (req, res) {
        var subject = {
            _id: req.params.id || '',
            _idsubject: req.body._idsubject || '',
            description: req.body.description || ''
        };

        teachersController.addSubject(subject).then(function (teacher) {
            res.json({
                success: true,
                data: teacher
            });
        }).catch(function (err) {
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

        teachersController.removeSubject(subject).then(function (teacher) {
            res.json({
                success: true,
                data: teacher
            });
        }).catch(function (err) {
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

        duration.start = req.body.duration && req.body.duration.start || '';
        duration.end = req.body.duration && req.body.duration.end || '';

        var item = {
            _id: req.params.id || '',
            day: req.body.day || '',
            duration: duration
        };

        teachersController.addSchedule(item).then(function (course) {
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

    /* DELETE remove a schedule. */
    router.delete('/:id/remove-schedule/:idschedule', function (req, res) {
        var item = {
            _id: req.params.id || '',
            _idschedule: req.params.idschedule || ''
        };

        teachersController.removeSchedule(item).then(function (course) {
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

    return router;
};

//# sourceMappingURL=teachers-compiled.js.map