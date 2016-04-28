/**
 * Created by jonathan on 25/02/16.
 */
'use strict';

var userController = require('../controller/users-controller');
var auth = require('../auth/auth');
var validator = require('validator');
var crypt = require('bcrypt');

var invalidLoginJSON = {
    success: false,
    data: "Usuário e/ou senha inválido."
};

var inativeUserJson = {
    success: false,
    data: "Usuário informado está inátivo."
};

module.exports.verifyLoginUser = function (user) {
    return new Promise(function (resolve, reject) {
        var userLogin = {
            username: user['login'] || '',
            password: user['password'] || ''
        };
        validateLogin(userLogin).then(getUser).then(function (user) {
            return comparePassword(userLogin, user);
        }).then(function (result) {
            if (result.match) {
                resolve(result.user);
            } else {
                reject(invalidLoginJSON);
            }
        }).catch(function (err) {
            reject({
                success: false,
                data: err
            });
        });
    });
};

var getUser = function getUser(userLogin) {
    if (validator.isEmail(userLogin.username)) return userController.getUserByEmail(userLogin.username);

    return userController.getUserByUserName(userLogin.username);
};

module.exports.lastUpdateLogin = function (user) {
    return new Promise(function (resolve, reject) {
        userController.updateLastLogin(user._id).then(resolve).catch(function (err) {
            reject({
                success: false,
                data: err
            });
        });
    });
};

module.exports.loginUser = function (user) {
    return new Promise(function (resolve, reject) {
        if (user.active) {
            (function () {
                var token = auth.getNewToken(user);
                userController.getUserByIdAllPath(user._id).then(function (userPath) {
                    resolve({ user: userPath, token: token });
                }, function (err) {
                    reject({
                        success: false,
                        data: err
                    });
                });
            })();
        } else {
            reject(inativeUserJson);
        }
    });
};

var validateLogin = function validateLogin(user) {
    return new Promise(function (resolve, reject) {
        var objRet = {};
        user['username'] = validator.trim(validator.escape(user['username'].toString() || ''));
        user['password'] = validator.trim(validator.escape(user['password'].toString() || ''));

        if (validator.isNull(user['username'])) objRet['username'] = 'Informe o E-mail ou Usuário.';

        if (validator.isNull(user['password'])) objRet['password'] = 'Senha é de preenchimento obrigatório.';

        if (Object.keys(objRet).length !== 0) {
            reject(objRet);
        } else {
            resolve(user);
        }
    });
};

var comparePassword = function comparePassword(candidateUser, userHash) {
    return new Promise(function (resolve, reject) {
        if (!userHash) {
            reject(invalidLoginJSON);
        } else {
            crypt.compare(candidateUser.password, userHash.password, function (err, isMatch) {
                if (err) reject(err);else {
                    resolve({ match: isMatch, user: userHash });
                }
            });
        }
    });
};

//# sourceMappingURL=auth-controller-compiled.js.map