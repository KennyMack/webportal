/*
 * Created by jonathan on 21/02/16.
 */
var express        = require('express');
var router         = express.Router();
var auth           = require('../auth/auth');
var authController = require('../controller/auth-controller');

router.post('/authenticate', function (req, res) {
    var user = {
        login: req.body.username || '' ,
        password: req.body.password || ''
    };

    authController.verifyLoginUser(user)
        .then(function (result) {
            return authController.lastUpdateLogin(result);
        })
        .then(function (user) {
            return authController.loginUser(user);
        })
        .then(function (token) {
            res.json({
                success: true,
                token: token,
                message: 'Enjoy your token'
            });
        })
        .fail(function (err) {
            res.json(err);
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