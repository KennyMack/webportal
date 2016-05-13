/**
 * Created by jonathan on 03/03/16.
 */
'use strict';

module.exports = function (express, io) {

    var router = express.Router();
    var auth = require('../auth/auth');
    var subjectsController = require('../controller/subjects-controller');
    var utils = require('../utils/utils');
    io.on('connection', function (socket) {
        console.log('Connection on Subjects');
        /*socket.on('big', ()=> {
         console.log('big');
         });
         socket.emit('get', { 'get':'Express' });*/
    });

    /* Middleware for authentication */
    router.use(function (req, res, next) {
        return auth.ensureAuthenticated(req, res, next);
    });

    /* GET Course Type listing. */
    router.get('/', function (req, res) {
        subjectsController.list().then(function (subjects) {
            res.json({
                success: true,
                data: subjects
            });
        }).catch(function (err) {
            res.json({
                success: false,
                data: err
            });
        });
    });

    /* GET Course Type by ID. */
    router.get('/:id', function (req, res) {
        var subject = {
            _id: req.params.id || ''
        };

        subjectsController.validate(subject, utils.OPERATION_STATUS.SELECT).then(function (psubject) {
            return subjectsController.getById(psubject['_id']);
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

    /* POST create a Course Type */
    router.post('/', function (req, res) {
        var subject = {
            description: req.body.description || ''
        };

        subjectsController.validate(subject, utils.OPERATION_STATUS.NEW).then(subjectsController.create).then(function (subject) {
            res.json({
                success: true,
                data: subject
            });
        }).catch(function (err) {
            res.json({
                success: false,
                data: err
            });
        });
    });

    /* PUT update a Course Type */
    router.put('/', function (req, res) {
        var subject = {
            _id: req.body._id || '',
            description: req.body.description || ''
        };

        subjectsController.validate(subject, utils.OPERATION_STATUS.UPDATE).then(subjectsController.update).then(function (result) {
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

    /* DELETE remove a Course Type by ID. */
    router.delete('/:id', function (req, res) {
        var subject = {
            _id: req.params.id || ''
        };

        subjectsController.validate(subject, utils.OPERATION_STATUS.DELETE).then(function (psubject) {
            return subjectsController.removeById(psubject['_id']);
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

//# sourceMappingURL=subjects-compiled.js.map