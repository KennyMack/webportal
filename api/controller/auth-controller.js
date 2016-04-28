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

module.exports.verifyLoginUser = (user) => {
    return new Promise((resolve, reject) => {
        let userLogin = {
            username: user['login'] || '',
            password: user['password'] || ''
        };
        validateLogin(userLogin)
            .then(getUser)
            .then((user) => {
                return comparePassword(userLogin, user);
            })
            .then((result) => {
                if (result.match) {
                    resolve(result.user);
                }
                else {
                    reject(invalidLoginJSON);
                }
            })
            .catch((err) => {
                reject({
                    success: false,
                    data: err
                });
            });
    });
};

const getUser =  (userLogin) => {
    if (validator.isEmail(userLogin.username))
        return userController.getUserByEmail(userLogin.username);

    return userController.getUserByUserName(userLogin.username);
};

module.exports.lastUpdateLogin = (user) => {
    return new Promise((resolve, reject) => {
        userController.updateLastLogin(user._id)
            .then(resolve)
            .catch((err) => {
                reject({
                    success: false,
                    data: err
                });
            });
    });
};

module.exports.loginUser = (user) => {
    return new Promise((resolve, reject)  => {
        if (user.active) {
            let token = auth.getNewToken(user);
            userController.getUserByIdAllPath(user._id)
                .then((userPath) => {
                    resolve({ user: userPath, token: token});
                },
                (err) => {
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

const validateLogin = (user) => {
    return new Promise((resolve, reject) => {
        let objRet = {};
        user['username'] = validator.trim(validator.escape(user['username'].toString() || ''));
        user['password'] = validator.trim(validator.escape(user['password'].toString() || ''));

        if (validator.isNull(user['username']))
            objRet['username'] = 'Informe o E-mail ou Usuário.';

        if (validator.isNull(user['password']))
            objRet['password'] = 'Senha é de preenchimento obrigatório.';

        if (Object.keys(objRet).length !== 0) {
            reject(objRet);
        }
        else {
            resolve(user);
        }
    });
};

const comparePassword = (candidateUser, userHash) => {
    return new Promise((resolve, reject) => {
        if (!userHash){
            reject(invalidLoginJSON);
        }
        else {
            crypt.compare(candidateUser.password, userHash.password,
                 (err, isMatch) => {
                    if (err)
                        reject(err);
                    else {
                        resolve({ match: isMatch, user: userHash});
                    }
                });
        }

    });
};