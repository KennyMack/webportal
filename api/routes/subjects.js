/**
 * Created by jonathan on 03/03/16.
 */
var express            = require('express');
var router             = express.Router();
var auth               = require('../auth/auth');
var subjectsController = require('../controller/subjects-controller');
var utils              = require('../utils/utils');

/* Middleware for authentication */
router.use(function (req, res, next) {
    return auth.ensureAuthenticated(req, res, next);
});

/* GET Course Type listing. */
router.get('/', function(req, res) {
    subjectsController.list()
        .then(function (subjects) {
            res.json({
                success: true,
                data: subjects
            });
        }, function(err){
            res.json({
                success: false,
                data: err
            });
        });

});

/* GET Course Type by ID. */
router.get('/:id', function (req, res) {
    var subject = {
        _id: req.params.id  || ''
    };

    var errors = subjectsController.validate(subject, utils.OPERATION_STATUS.SELECT);

    if (Object.keys(errors).length !== 0) {
        res.json({
            success: false,
            data: errors
        });
    }
    else {
        subjectsController.getById(subject['_id'])
            .then(function (subject) {
                if (subject) {
                    res.json({
                        success: true,
                        data: subject
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

/* POST create a Course Type */
router.post('/', function (req, res) {
    var subject = {
        description: req.body.description  || ''
    };

    var errors = subjectsController.validate(subject, utils.OPERATION_STATUS.NEW);

    if (Object.keys(errors).length !== 0) {
        res.json({
            success: false,
            data: errors
        });
    }
    else{
        subjectsController.create(subject)
            .then(function (subject) {
                res.json({
                    success: true,
                    data: subject
                });
            }, function (err) {
                res.json({
                    success: false,
                    data: err
                });
            });

    }
});


/* PUT update a Course Type */
router.put('/', function (req, res) {
    var subject = {
        _id: req.body._id || '',
        description: req.body.description || ''
    };

    var errors = subjectsController.validate(subject, utils.OPERATION_STATUS.UPDATE);

    if (Object.keys(errors).length !== 0) {
        res.json({
            success: false,
            data: errors
        });
    }
    else{
        subjectsController.update(subject)
            .then(function (subject) {
                res.json({
                    success: true,
                    data: subject
                });
            }, function (err) {
                res.json({
                    success: false,
                    data: err
                });
            });

    }
});


/* DELETE remove a Course Type by ID. */
router.delete('/:id', function (req, res) {
    var subject = {
        _id: req.params.id  || ''
    };


    var errors = subjectsController.validate(subject, utils.OPERATION_STATUS.DELETE);

    if (Object.keys(errors).length !== 0) {
        res.json({
            success: false,
            data: errors
        });
    }
    else{
        subjectsController.removeById(subject['_id'])
            .then(function (subject) {
                if (subject) {
                    res.json({
                        success: true,
                        data: subject
                    });
                } else {
                    res.status(404).json({
                        success: false,
                        data: '404 - Not Found'
                    });
                }
            }, function(err){
                res.json({
                    success: false,
                    data: err
                });
            });
    }
});

module.exports = router;