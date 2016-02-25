/**
 * Created by jonathan on 21/02/16.
 */
var jwt = require('jsonwebtoken');
var config = require('../config/config.js');


var validateToken = function(token, callback) {
    jwt.verify(token, config['secretKey'],  function (err, decoded) {
        callback(err, decoded);
    });
};

module.exports.ensureAuthenticated = function(req, res, next) {

    //var token = req.headers['x-access-token']|| req.body.token || req.params.token;

    if (req.token) {
        validateToken(req.token, function (err, decoded) {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).json({
            success: false,
            message: 'No token provided.'
        });

    }
};

module.exports.validateToken = validateToken;

module.exports.getNewToken = function (user){
    return jwt.sign({
        _id: user._id,
        name: user.name,
        username: user.username,
        date: Date.now()
    }, config['secretKey'], {
        expiresIn: '24h'
    });
};
