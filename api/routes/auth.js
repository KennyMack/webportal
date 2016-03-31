/*
 * Created by jonathan on 21/02/16.
 */
module.exports = function (express, io) {

    var router = express.Router();
    var auth = require('../auth/auth');
    var authController = require('../controller/auth-controller');

    io.on('connection', function(socket){
        console.log('Connection on Auth');
        /*socket.on('big', function(){
         console.log('big');
         });
         socket.emit('get', { 'get':'Express' });*/
    });

    router.post('/authenticate', function (req, res) {
        var user = {
            login: req.body.username || '',
            password: req.body.password || ''
        };

        authController.verifyLoginUser(user)
            .then(function (result) {
                return authController.lastUpdateLogin(result);
            })
            .then(function (user) {
                return authController.loginUser(user);
            })
            .then(function (ut) {
                var usr = {
                    _id: ut.user._id,
                    email: ut.user.email,
                    username: ut.user.username,
                    last_login: ut.user.last_login,
                    student_id: ut.user.student_id,
                    teachers_id: ut.user.teachers_id,
                    manager_id: ut.user.manager_id,
                    master_id: ut.user.master_id
                };
                res.json({
                    success: true,
                    token: ut.token,
                    user: usr,
                    message: 'Enjoy your token'
                });
            })
            .fail(function (err) {
                res.json(err);
            });
    });


    router.get('/credential', auth.ensureAuthenticated, function (req, res) {
        res.json({
            success: true,
            credential: req.decoded
        })
    });

    return router;

};