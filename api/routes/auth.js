/**
 * Created by jonathan on 21/02/16.
 */
var express = require('express');
var router = express.Router();
var auth = require('../auth/auth');
var authController = require('../controller/auth-controller');

router.post('/authenticate', function (req, res) {
    var user = {
        login: req.body.username || '' ,
        password: req.body.password || ''
    };
    authController.verifyLoginUser(user)
        .then(function (result) {
            authController.loginUser(result)
                .then(function (token) {
                    authController.lastUpdateLogin(result._id)
                        .then(function (user) {
                            res.json(token);
                        }, function (err) {
                            res.json(token);
                        });

                })
                .fail(function (error) {
                    res.json(error);
                });
        })
        .fail(function (error) {
            res.json(error);
        });
});


router.get('/credential', auth.ensureAuthenticated, function (req, res) {
   console.log(req.decoded);
   res.json({
       success: true,
       credential: req.decoded
   })
});

module.exports = router;