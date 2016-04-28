/**
 * Created by jonathan on 03/03/16.
 */
'use strict';

module.exports =  (express, io) => {

    const router = express.Router();
    const auth = require('../auth/auth');
    const teachersController = require('../controller/teachers-controller');
    const utils = require('../utils/utils');

    io.on('connection',  (socket) => {
        console.log('Connection on Teachers');
        /*socket.on('big', ()=> {
         console.log('big');
         });
         socket.emit('get', { 'get':'Express' });*/
    });

    /* Middleware for authentication */
    router.use( (req, res, next) => {
        return auth.ensureAuthenticated(req, res, next);
    });

    /* GET Teacher listing. */
    router.get('/',  (req, res) => {
        teachersController.listTeachers()
            .then( (teachers) => {
                res.json({
                    success: true,
                    data: teachers
                });
            })
            .catch( (err) => {
                res.json({
                    success: false,
                    data: err
                });
            });

    });

    /* GET Teacher by ID. */
    router.get('/:id',  (req, res) => {
        let teacher = {
            _id: req.params.id || ''
        };

        teachersController.validateTeacher(teacher, utils.OPERATION_STATUS.SELECT)
            .then( (item) => {
                return teachersController.getById(item['_id'])
            })
            .then( (teacher) => {
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
            })
            .catch( (err) => {
                res.json({
                    success: false,
                    data: err
                });
            });
    });

    /* POST create a Teacher */
    router.post('/',  (req, res) => {
        let teacher = {
            identify: req.body.identify || '',
            name: req.body.name || '',
            gender: req.body.gender || '',
            dob: req.body.dob || '',
            active: req.body.active || '1',
            social_number: req.body.social_number || ''
        };

        teachersController.validateTeacher(teacher, utils.OPERATION_STATUS.NEW)
            .then(teachersController.createTeacher)
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


    /* PUT update a Teacher */
    router.put('/',  (req, res) => {
        let teacher = {
            _id: req.body._id || '',
            identify: req.body.identify || '',
            name: req.body.name || '',
            gender: req.body.gender || '',
            dob: req.body.dob || '',
            active: req.body.active || '1',
            social_number: req.body.social_number || ''
        };

        teachersController.validateTeacher(teacher, utils.OPERATION_STATUS.UPDATE)
            .then(teachersController.updateTeacher)
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


    /* DELETE remove a Teacher by ID. */
    router.delete('/:id',  (req, res) => {
        let teacher = {
            _id: req.params.id || ''
        };

        teachersController.validateTeacher(teacher, utils.OPERATION_STATUS.DELETE)
            .then( (pteacher) => {
                return teachersController.removeById(pteacher['_id'])
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


    /* POST add a Subject. */
    router.post('/:id/add-subject',  (req, res) => {
        let subject = {
            _id: req.params.id || '',
            _idsubject: req.body._idsubject || '',
            description: req.body.description || ''
        };

        teachersController.addSubject(subject)
            .then( (teacher) => {
                res.json({
                    success: true,
                    data: teacher
                });
            })
            .catch( (err) => {
                res.json({
                    success: false,
                    data: err
                });
            });
    });


    /* DELETE remove a subject. */
    router.delete('/:id/remove-subject/:idsubject',  (req, res) => {
        let subject = {
            _id: req.params.id || '',
            _idsubject: req.params.idsubject || ''
        };

        teachersController.removeSubject(subject)
            .then( (teacher) => {
                res.json({
                    success: true,
                    data: teacher
                });
            })
            .catch( (err) => {
                res.json({
                    success: false,
                    data: err
                });
            });
    });

    /* POST add a schedule. */
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
            duration: duration
        };


        teachersController.addSchedule(item)
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

    /* DELETE remove a schedule. */
    router.delete('/:id/remove-schedule/:idschedule',  (req, res) => {
        let item = {
            _id: req.params.id || '',
            _idschedule: req.params.idschedule || ''
        };

        teachersController.removeSchedule(item)
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

    return router;
};