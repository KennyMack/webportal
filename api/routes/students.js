/**
 * Created by jonathan on 06/03/16.
 */
'use strict';

module.exports =  (express, io) => {

    const router = express.Router();
    const auth = require('../auth/auth');
    const studentsController = require('../controller/students-controller');
    const utils = require('../utils/utils');

    io.on('connection', (socket)=> {
        console.log('Connection on Students');
        /*socket.on('big', ()=> {
         console.log('big');
         });
         socket.emit('get', { 'get':'Express' });*/
    });

    /* Middleware for authentication */
    router.use( (req, res, next) => {
        return auth.ensureAuthenticated(req, res, next);
    });

    /* GET student listing. */
    router.get('/',  (req, res) => {
        studentsController.list()
            .then( (students) => {
                res.json({
                    success: true,
                    data: students
                });
            })
            .catch( (err) => {
                res.json({
                    success: false,
                    data: err
                });
            });

    });

    /* GET student by ID. */
    router.get('/:id',  (req, res) => {
        let student = {
            _id: req.params.id || ''
        };

        studentsController.validate(student, utils.OPERATION_STATUS.SELECT)
            .then( (rstudent) => {
                return studentsController.getById(rstudent['_id']);
            })
            .then( (students) => {
                if (students) {
                    res.json({
                        success: true,
                        data: students
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

    /* POST create a student */
    router.post('/',  (req, res) => {
        let student = {
            identify: req.body.identify || '',
            name: req.body.name || '',
            gender: req.body.gender || '',
            dob: req.body.dob || '',
            active: req.body.active || '1',
            social_number: req.body.social_number || ''
        };

        studentsController.validate(student, utils.OPERATION_STATUS.NEW)
            .then(studentsController.create)
            .then( (student) => {
                res.json({
                    success: true,
                    data: student
                });
            })
            .catch( (err) => {
                res.json({
                    success: false,
                    data: err
                });
            });
    });


    /* PUT update a student */
    router.put('/',  (req, res) => {
        let student = {
            _id: req.body._id || '',
            identify: req.body.identify || '',
            name: req.body.name || '',
            gender: req.body.gender || '',
            dob: req.body.dob || '',
            active: req.body.active || '1',
            social_number: req.body.social_number || ''
        };

        studentsController.validate(student, utils.OPERATION_STATUS.UPDATE)
            .then(studentsController.update)
            .then( (student) => {
                res.json({
                    success: true,
                    data: student
                });
            })
            .catch( (err) => {
                res.json({
                    success: false,
                    data: err
                });
            });
    });


    /* DELETE remove a student. */
    router.delete('/:id',  (req, res) => {
        let student = {
            _id: req.params.id || ''
        };


        studentsController.validate(student, utils.OPERATION_STATUS.DELETE)
            .then( (rstudent) => {
                return studentsController.removeById(rstudent['_id']);
            })
            .then( (student) => {
                if (student) {
                    res.json({
                        success: true,
                        data: student
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