/**
 * Created by jonathan on 28/04/16.
 */
'use strict';

module.exports =  (express, io) => {

    const mastersController = require('../controller/masters-controller');
    const router            = express.Router();
    const auth              = require('../auth/auth');
    const utils             = require('../utils/utils');

    io.on('connection', (socket)=> {
        console.log('Connection on masters');
        /*socket.on('big', ()=> {
         console.log('big');
         });
         socket.emit('get', { 'get':'Express' });*/
    });

    /* Middleware for authentication */
    router.use( (req, res, next) => {
        return auth.ensureAuthenticated(req, res, next);
    });

    /* GET master listing. */
    router.get('/',  (req, res) => {
        mastersController.list()
            .then( (masters) => {
                res.json({
                    success: true,
                    data: masters
                });
            })
            .catch( (err) => {
                res.json({
                    success: false,
                    data: err
                });
            });

    });

    /* GET master by ID. */
    router.get('/:id',  (req, res) => {
        let master = {
            _id: req.params.id || ''
        };

        mastersController.validate(master, utils.OPERATION_STATUS.SELECT)
            .then( (rmaster) => {
                return mastersController.getById(rmaster['_id']);
            })
            .then( (masters) => {
                if (masters) {
                    res.json({
                        success: true,
                        data: masters
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

    /* POST create a master */
    router.post('/',  (req, res) => {
        let master = {
            identify: req.body.identify || '',
            name: req.body.name || '',
            gender: req.body.gender || '',
            dob: req.body.dob || '',
            active: req.body.active || '1',
            social_number: req.body.social_number || ''
        };

        mastersController.validate(master, utils.OPERATION_STATUS.NEW)
            .then(mastersController.create)
            .then( (master) => {
                res.json({
                    success: true,
                    data: master
                });
            })
            .catch( (err) => {
                res.json({
                    success: false,
                    data: err
                });
            });
    });


    /* PUT update a master */
    router.put('/',  (req, res) => {
        let master = {
            _id: req.body._id || '',
            identify: req.body.identify || '',
            name: req.body.name || '',
            gender: req.body.gender || '',
            dob: req.body.dob || '',
            active: req.body.active || '1',
            social_number: req.body.social_number || ''
        };

        mastersController.validate(master, utils.OPERATION_STATUS.UPDATE)
            .then(mastersController.update)
            .then( (master) => {
                res.json({
                    success: true,
                    data: master
                });
            })
            .catch( (err) => {
                res.json({
                    success: false,
                    data: err
                });
            });
    });


    /* DELETE remove a master. */
    router.delete('/:id',  (req, res) => {
        let master = {
            _id: req.params.id || ''
        };


        mastersController.validate(master, utils.OPERATION_STATUS.DELETE)
            .then( (rmaster) => {
                return mastersController.removeById(rmaster['_id']);
            })
            .then( (masters) => {
                if (masters) {
                    res.json({
                        success: true,
                        data: masters
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