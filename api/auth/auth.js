/**
 * Created by jonathan on 21/02/16.
 */
'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config/config.js');
const util = require('../utils/utils');

const validateToken = (token, callback) => {
    jwt.verify(token, config['secretKey'],   (err, decoded) => {
        callback(err, decoded);
    });
};

module.exports.ensureAuthenticated = (req, res, next) => {

    let token = req.headers['x-access-token'] || req.body.token || req.params.token;

    if (token) {
        validateToken(token,  (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    data: 'Failed to authenticate token.'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).json({
            success: false,
            data: 'No token provided.'
        });
    }
};

module.exports.validateToken = validateToken;

module.exports.getNewToken =  (user) => {
    return jwt.sign({
        _id: user._id,
        email: user.email,
        username: user.username,
        persons: user.persons,
        date: util.getCurrentDateTime()
    }, config['secretKey'], {
        expiresIn: '24h'
    });
};
