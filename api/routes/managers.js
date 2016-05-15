/**
 * Created by jonathan on 28/04/16.
 */
'use strict';

module.exports =  (express, io) => {

    const managersController = require('../controller/managers-controller');
    const router             = express.Router();
    const auth               = require('../auth/auth');
    const utils              = require('../utils/utils');

    io.on('connection', (socket)=> {
        console.log('Connection on managers');
        /*socket.on('big', ()=> {
         console.log('big');
         });
         socket.emit('get', { 'get':'Express' });*/
    });

    /* Middleware for authentication */
    router.use( (req, res, next) => {
        return auth.ensureAuthenticated(req, res, next);
    });

    /* GET manager listing. */
    router.get('/',  (req, res) => {
        managersController.list()
            .then( (managers) => {
                res.json({
                    success: true,
                    data: managers
                });
            })
            .catch( (err) => {
                res.json({
                    success: false,
                    data: err
                });
            });

    });

    /* GET manager by ID. */
    router.get('/:id',  (req, res) => {
        let manager = {
            _id: req.params.id || ''
        };

        managersController.validate(manager, utils.OPERATION_STATUS.SELECT)
            .then( (rmanager) => {
                return managersController.getById(rmanager['_id']);
            })
            .then( (managers) => {
                if (managers) {
                    res.json({
                        success: true,
                        data: managers
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

    /* POST create a manager */
    router.post('/',  (req, res) => {
        let manager = {
            identify: req.body.identify || '',
            name: req.body.name || '',
            gender: req.body.gender || '',
            dob: req.body.dob || '',
            active: req.body.active || '1',
            social_number: req.body.social_number || ''
        };

        managersController.validate(manager, utils.OPERATION_STATUS.NEW)
            .then(managersController.create)
            .then( (manager) => {
                res.json({
                    success: true,
                    data: manager
                });
            })
            .catch( (err) => {
                res.json({
                    success: false,
                    data: err
                });
            });
    });

    /* PUT update a manager */
    router.put('/',  (req, res) => {
        let manager = {
            _id: req.body._id || '',
            identify: req.body.identify || '',
            name: req.body.name || '',
            gender: req.body.gender || '',
            dob: req.body.dob || '',
            active: req.body.active || '1',
            social_number: req.body.social_number || ''
        };

        managersController.validate(manager, utils.OPERATION_STATUS.UPDATE)
            .then(managersController.update)
            .then( (manager) => {
                res.json({
                    success: true,
                    data: manager
                });
            })
            .catch( (err) => {
                res.json({
                    success: false,
                    data: err
                });
            });
    });


    /* DELETE remove a manager. */
    router.delete('/:id',  (req, res) => {
        let manager = {
            _id: req.params.id || ''
        };


        managersController.validate(manager, utils.OPERATION_STATUS.DELETE)
            .then( (rmanager) => {
                return managersController.removeById(rmanager['_id']);
            })
            .then( (manager) => {
                if (manager) {
                    res.json({
                        success: true,
                        data: manager
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