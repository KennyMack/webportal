/**
 * Created by jonathan on 03/03/16.
 */
'use strict';

module.exports =  (express, io) => {

    const router = express.Router();
    const auth = require('../auth/auth');
    const subjectsController = require('../controller/subjects-controller');
    const utils = require('../utils/utils');
    io.on('connection',  (socket) => {
        console.log('Connection on Subjects');
        /*socket.on('big', ()=> {
         console.log('big');
         });
         socket.emit('get', { 'get':'Express' });*/
    });

    /* Middleware for authentication */
    router.use( (req, res, next) => {
        return auth.ensureAuthenticated(req, res, next);
    });

    /* GET Course Type listing. */
    router.get('/',  (req, res) => {
        subjectsController.list()
            .then( (subjects) => {
                res.json({
                    success: true,
                    data: subjects
                });
            })
            .catch( (err) => {
                res.json({
                    success: false,
                    data: err
                });
            });

    });

    /* GET Course Type by ID. */
    router.get('/:id',  (req, res) => {
        let subject = {
            _id: req.params.id || ''
        };

        subjectsController.validate(subject, utils.OPERATION_STATUS.SELECT)
            .then( (psubject) => {
                return subjectsController.getById(psubject['_id'])
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

    /* POST create a Course Type */
    router.post('/',  (req, res) => {
        let subject = {
            description: req.body.description || ''
        };

        subjectsController.validate(subject, utils.OPERATION_STATUS.NEW)
            .then(subjectsController.create)
            .then( (subject) => {
                res.json({
                    success: true,
                    data: subject
                });
            })
            .catch( (err) => {
                res.json({
                    success: false,
                    data: err
                });
            });
    });


    /* PUT update a Course Type */
    router.put('/',  (req, res) => {
        let subject = {
            _id: req.body._id || '',
            description: req.body.description || ''
        };

        subjectsController.validate(subject, utils.OPERATION_STATUS.UPDATE)
            .then(subjectsController.update)
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


    /* DELETE remove a Course Type by ID. */
    router.delete('/:id',  (req, res) => {
        let subject = {
            _id: req.params.id || ''
        };

        subjectsController.validate(subject, utils.OPERATION_STATUS.DELETE)
            .then( (psubject) => {
                return subjectsController.removeById(psubject['_id']);
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