/**
 * Created by jonathan on 06/03/16.
 */
'use strict';

module.exports = function (express, io) {

    const router = express.Router();
    const auth = require('../auth/auth');
    const studentsController = require('../controller/students-controller');
    const utils = require('../utils/utils');

    io.on('connection', function(socket){
        console.log('Connection on Students');
        /*socket.on('big', function(){
         console.log('big');
         });
         socket.emit('get', { 'get':'Express' });*/
    });

    /* Middleware for authentication */
    router.use(function (req, res, next) {
        return auth.ensureAuthenticated(req, res, next);
    });

    /* GET student listing. */
    router.get('/', function (req, res) {
        studentsController.list()
            .then(function (students) {
                res.json({
                    success: true,
                    data: students
                });
            })
            .catch(function (err) {
                res.json({
                    success: false,
                    data: err
                });
            });

    });

    /* GET student by ID. */
    router.get('/:id', function (req, res) {
        let student = {
            _id: req.params.id || ''
        };

        studentsController.validate(student, utils.OPERATION_STATUS.SELECT)
            .then(function (rstudent) {
                return studentsController.getById(rstudent['_id']);
            })
            .then(function (students) {
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
            .catch(function (err) {
                res.json({
                    success: false,
                    data: err
                });
            });
    });

    /* POST create a student */
    router.post('/', function (req, res) {
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
            .then(function (student) {
                res.json({
                    success: true,
                    data: student
                });
            })
            .catch(function (err) {
                res.json({
                    success: false,
                    data: err
                });
            });
    });


    /* PUT update a student */
    router.put('/', function (req, res) {
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
            .then(function (student) {
                res.json({
                    success: true,
                    data: student
                });
            })
            .catch(function (err) {
                res.json({
                    success: false,
                    data: err
                });
            });
    });


    /* DELETE remove a student. */
    router.delete('/:id', function (req, res) {
        let student = {
            _id: req.params.id || ''
        };


        studentsController.validate(student, utils.OPERATION_STATUS.DELETE)
            .then(function (rstudent) {
                return studentsController.removeById(rstudent['_id']);
            })
            .then(function (student) {
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
            .catch(function (err) {
                res.json({
                    success: false,
                    data: err
                });
            });
    });

    return router;
};