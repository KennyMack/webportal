/**
 * Created by jonathan on 06/03/16.
 */
module.exports = function (express, io) {

    var router = express.Router();
    var auth = require('../auth/auth');
    var studentsController = require('../controller/students-controller');
    var utils = require('../utils/utils');

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
            }, function (err) {
                res.json({
                    success: false,
                    data: err
                });
            });

    });

    /* GET student by ID. */
    router.get('/:id', function (req, res) {
        var student = {
            _id: req.params.id || ''
        };

        var errors = studentsController.validate(student, utils.OPERATION_STATUS.SELECT);

        if (Object.keys(errors).length !== 0) {
            res.json({
                success: false,
                data: errors
            });
        }
        else {
            studentsController.getById(student['_id'])
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
                }, function (err) {
                    res.json({
                        success: false,
                        data: err
                    });
                });
        }
    });

    /* POST create a student */
    router.post('/', function (req, res) {
        var student = {
            identify: req.body.identify || '',
            name: req.body.name || '',
            gender: req.body.gender || '',
            dob: req.body.dob || '',
            active: req.body.active || '1',
            social_number: req.body.social_number || ''
        };

        var errors = studentsController.validate(student, utils.OPERATION_STATUS.NEW);

        if (Object.keys(errors).length !== 0) {
            res.json({
                success: false,
                data: errors
            });
        }
        else {
            studentsController.create(student)
                .then(function (student) {
                    res.json({
                        success: true,
                        data: student
                    });
                }, function (err) {
                    res.json({
                        success: false,
                        data: err
                    });
                });

        }
    });


    /* PUT update a student */
    router.put('/', function (req, res) {
        var student = {
            _id: req.body._id || '',
            identify: req.body.identify || '',
            name: req.body.name || '',
            gender: req.body.gender || '',
            dob: req.body.dob || '',
            active: req.body.active || '1',
            social_number: req.body.social_number || ''
        };

        var errors = studentsController.validate(student, utils.OPERATION_STATUS.UPDATE);

        if (Object.keys(errors).length !== 0) {
            res.json({
                success: false,
                data: errors
            });
        }
        else {
            studentsController.update(student)
                .then(function (student) {
                    res.json({
                        success: true,
                        data: student
                    });
                }, function (err) {
                    res.json({
                        success: false,
                        data: err
                    });
                });

        }
    });


    /* DELETE remove a student. */
    router.delete('/:id', function (req, res) {
        var student = {
            _id: req.params.id || ''
        };


        var errors = studentsController.validate(student, utils.OPERATION_STATUS.DELETE);

        if (Object.keys(errors).length !== 0) {
            res.json({
                success: false,
                data: errors
            });
        }
        else {
            studentsController.removeById(student['_id'])
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
                }, function (err) {
                    res.json({
                        success: false,
                        data: err
                    });
                });
        }
    });

    return router;
};