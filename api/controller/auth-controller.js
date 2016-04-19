/**
 * Created by jonathan on 25/02/16.
 */
'use strict';

const userController = require('../controller/users-controller');
const auth           = require('../auth/auth');
const validator      = require('validator');
const crypt          = require('bcrypt');

const invalidLoginJSON = {
    success: false,
    data: "Usuário e/ou senha inválido."
};

const inativeUserJson = {
    success: false,
    data: "Usuário informado está inátivo."
};

module.exports.verifyLoginUser = function (user) {
    return new Promise(function (resolve, reject) {
        let userLogin = {
            username: user['login'] || '',
            password: user['password'] || ''
        };
        let errors = validateLogin(userLogin);

        if (Object.keys(errors).length !== 0) {
            reject({
                success: false,
                data: errors
            });
        }
        else {
            if (validator.isEmail(userLogin.username)){
                userController.getUserByEmail(userLogin.username)
                    .then(function (user) {
                        return comparePassword(userLogin, user);
                    })
                    .then(function (result) {
                        if (result.match) {
                            resolve(result.user);
                        }
                        else {
                            reject(invalidLoginJSON);
                        }
                    })
                    .catch(function (err) {
                        reject({
                            success: false,
                            data: err
                        });
                    });
            }
            else {
                userController.getUserByUserName(userLogin.username)
                    .then(function (user) {
                        return comparePassword(userLogin, user);
                    })
                    .then(function (result) {
                        if (result.match) {
                            resolve(result.user);
                        }
                        else {
                            reject(invalidLoginJSON);
                        }
                    })
                    .catch(function (err) {
                        reject({
                            success: false,
                            data: err
                        });
                    });
            }
        }

    });
};

module.exports.lastUpdateLogin = function (user) {
    return new Promise(function (resolve, reject) {
        userController.updateLastLogin(user._id)
            .then(function (user) {
                resolve(user);
            })
            .catch(function (err) {
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
            let token = auth.getNewToken(user);
            userController.getUserByIdAllPath(user._id)
                .then(function (userPath) {
                    resolve({ user: userPath, token: token});
                },
                function (err) {
                    reject({
                        success: false,
                        data: err
                    });
                });
        }
        else {
            reject(inativeUserJson);
        }

    });
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

var comparePassword = function(candidateUser, userHash){
    return new Promise(function (resolve, reject) {
        if (!userHash){
            reject(invalidLoginJSON);
        }
        else {

            crypt.compare(candidateUser.password, userHash.password,
                function (err, isMatch) {
                    if (err)
                        reject(err);
                    else {
                        resolve({ match: isMatch, user: userHash});
                    }
                });
        }

    });
};