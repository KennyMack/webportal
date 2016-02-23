/**
 * Created by jonathan on 21/02/16.
 */
var express = require('express');
var router = express.Router();
var auth = require('../auth/auth');

router.post('/authenticate', function (req, res) {
    var user = {
        username: String,
        name: String,
        _id: String,
        password: String
    };
    user.username = 'Kenny';
    user.name = 'Jonathan';
    user._id = 'objectid123456';
    user.password = '123456';

    if (user.username == req.body.username &&
        user.name == req.body.name &&
        user.password == req.body.password){
        var token = auth.getNewToken(user);
        res.json({
            success: true,
            token: token,
            message: 'Enjoy your token'
        });
    }
    else {
        res.status(401).json({
            success: false,
            message: 'Invalid login'
        });
    }
});


router.get('/credential', auth.ensureAuthenticated, function (req, res) {
   console.log(req.decoded);
   res.json({
       success: true,
       credential: req.decoded
   })
});

module.exports = router;