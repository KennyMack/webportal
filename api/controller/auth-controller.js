/**
 * Created by jonathan on 25/02/16.
 */
var userController = require('../controller/users-controller');
var auth           = require('../auth/auth');
var validator      = require('validator');
var crypt          = require('bcrypt');
var util           = require('../utils/utils');
var q              = require('q');

var invalidLoginJSON = {
    success: false,
    message: "Usuário e/ou senha inválido."
};

var inativeUserJson = {
    success: false,
    message: "Usuário informado está inátivo."
};

module.exports.verifyLoginUser = function (user, callback) {
    var deferred = q.defer();
    var userLogin = {
        username: user['login'] || '',
        password: user['password'] || ''
    };
    console.log(userLogin);
    var errors = validateLogin(userLogin);

    if (Object.keys(errors).length !== 0) {
        console.log("Errors");
        deferred.reject({
            success: false,
            message: errors
        });
    }
    else {
        if (validator.isEmail(userLogin.username)){
            userController.getUserByEmail(userLogin.username)
                .then(function (user) {
                    if (!user){
                        deferred.reject(invalidLoginJSON);
                    }
                    else {
                        comparePassword(userLogin.password, user.password, function (err, match) {
                            if (err) throw err;
                            if (match) {
                                deferred.resolve(user);
                            }
                            else {
                                deferred.reject(invalidLoginJSON);
                            }
                        });
                    }
                },
                function (err) {
                    deferred.reject({
                        success: false,
                        message: err
                    });
                });
        }
        else {
            userController.getUserByUserName(userLogin.username)
                .then(function (user) {
                    if (!user){
                        deferred.reject(invalidLoginJSON);
                    }
                    else {
                        comparePassword(userLogin.password, user.password, function (err, match) {
                            if (err) throw err;
                            if (match) {
                                deferred.resolve(user);
                            }
                            else {
                                deferred.reject(invalidLoginJSON);
                            }
                        });
                    }
                },
                function (err) {
                    deferred.reject({
                        success: false,
                        message: err
                    });
                });
        }


    }

    deferred.promise.nodeify(callback);
    return deferred.promise;
};

module.exports.lastUpdateLogin = function (id) {
    return userController.updateLastLogin(id);
};

module.exports.loginUser = function (user, callback) {
    var deferred = q.defer();
    if (user.active) {
        var token = auth.getNewToken(user);
        deferred.resolve({
            success: true,
            token: token,
            message: 'Enjoy your token'
        });
        //TODO: Update data do ultimo login do usuário
    }
    else {
        deferred.reject(inativeUserJson);
    }
    deferred.promise.nodeify(callback);
    return deferred.promise;
};

var validateLogin = function (user) {
    var objRet = {};
    user['username'] = validator.trim(validator.escape(user['username'].toString() || ''));
    user['password'] = validator.trim(validator.escape(user['password'].toString() || ''));

    if (validator.isNull(user['username']))
        objRet['username'] = 'Informe o E-mail ou Usuário.';

    if (validator.isNull(user['password']))
        objRet['password'] = 'Senha é de preenchimento obrigatório.';

    return objRet;
};




var comparePassword = function(candidatePassword, hash, callback){
    crypt.compare(candidatePassword, hash, function(err, isMatch){
        if (err) return callback(err);
        callback(null, isMatch);
    });
};