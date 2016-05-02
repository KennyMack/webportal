/**
 * Created by jonathan on 21/02/16.
 */
'use strict';

const usersModel = require('../models/users-model');
const validator  = require('validator');
const utils      = require('../utils/utils');

// List all Users
module.exports.listUsers = () => {
    return new Promise((resolve, reject) => {
        usersModel.users.find({}).exec()
            .then(resolve, reject);
    });
};

// Get User By Id
module.exports.getUserById = (id)=> {
    return new Promise((resolve, reject) => {
        usersModel.users.findById(id).exec()
            .then(resolve, reject);
    });
};

// Get User By Id
module.exports.getUserByIdAllPath = (id)=> {
    return new Promise((resolve, reject) => {
        usersModel.users.findById(id)
            .populate('student_id', 'name')
            .populate('teachers_id', 'name')
            .populate('master_id', 'name')
            .populate('manager_id', 'name')
            .exec()
            .then(resolve, reject);
    });
};

// Get User By UserName
module.exports.getUserByUserName = (username)=> {
    return new Promise( (resolve, reject) => {
        usersModel.users.findOne({ username: username }).exec()
            .then(resolve, reject);
    });
};

// Get User By Email
module.exports.getUserByEmail = (email)=> {
    return new Promise( (resolve, reject) => {
        usersModel.users.findOne({ email: email }).exec()
            .then(resolve, reject);
    });
};

// Remove User By Id
module.exports.removeById = (id) => {
    return new Promise((resolve, reject) => {
        usersModel.users.findByIdAndRemove(id).exec()
            .then(resolve, reject);
    });
};

// Create a new User
module.exports.createUser = (user) => {
    return new Promise((resolve, reject) => {
        new usersModel.users({
            'email': user['email'],
            'username': user['username'],
            'password': user['password'],
            'active': user['active']
        }).save()
            .then(resolve, reject);
    });
};

// Update a User
module.exports.updateUser =  (user) => {
    return new Promise((resolve, reject) => {
        let query = {_id: user['_id']};
        let data = {
            'username': user['username'],
            'password': user['password'],
            'email': user['email'],
            'active': user['active']
        };

        usersModel.users.findOneAndUpdate(query, data, {upsert: false, new: true}).exec()
            .then(resolve, reject);
    });
};

// Update last Login
module.exports.updateLastLogin =  (id) => {
    return new Promise( (resolve, reject) => {
        let query = { '_id': id};
        let data = {
            $set: {
                last_login: utils.getCurrentDateTime()
            }
        };
        let options = { upsert: false };

        usersModel.users.findOneAndUpdate(query, data, options,  (err, data) => {
            if(err) {
                reject(err);
            }
            else{
                resolve(data);
            }
        });

    });
};

// Define a Person in user
module.exports.setLoginPerson = (user) => {
    return new Promise((resolve, reject)=> {
        user['_id'] = validator.trim(validator.escape(user['_id'].toString() || ''));
        user['idparent'] = validator.trim(validator.escape(user['idparent'].toString() || ''));
        user['type'] = validator.trim(validator.escape(user['type'].toString() || ''));

        let objRet = {};

        let typeNull = validator.isNull(user['type']);
        let idUserNull = validator.isNull(user['_id']);
        let idParentNull = validator.isNull(user['idparent']);

        if (typeNull)
            objRet['type'] = 'Tipo do usuário é de preenchimento obrigatório.';

        if (!typeNull && (!validator.isIn(user['type'], ['student', 'teacher', 'manager', 'master'])))
            objRet['type'] = 'Tipo do usuário informado não é válido.';

        if (idUserNull)
            objRet['_id'] = 'Id do usuário é de preenchimento obrigatório.';

        if (!idUserNull && (!validator.isMongoId(user['_id'])))
            objRet['_id'] = 'Id do usuário informado é inválido.';

        if (idParentNull)
            objRet['idparent'] = 'Id da pessoa é de preenchimento obrigatório.';

        if (!idParentNull && (!validator.isMongoId(user['idparent'])))
            objRet['idparent'] = 'Id da pessoa informado é inválido.';

        if (Object.keys(objRet).length !== 0) {
            reject(objRet);
        }
        else {
            let query = {_id: user['_id']};
            let data = {};

            if (user['type'].toString() === 'student') {
                data = {
                    $set: {
                        "student_id": user['idparent']
                    }
                };
            }
            else if (user['type'].toString() === 'teacher') {
                data = {
                    $set: {
                        "teachers_id": user['idparent']
                    }
                };
            }
            else if (user['type'].toString() === 'manager') {
                data = {
                    $set: {
                        "manager_id":  user['idparent']
                    }
                };
            }
            else if (user['type'].toString() === 'master') {
                data = {
                    $set: {
                        "master_id": user['idparent']
                    }
                };
            }

            let options = { safe: true, upsert: false, new: true };
            usersModel.users.findOneAndUpdate(query, data, options,  (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        }
    });
};

module.exports.validateUser =  (user, status) => {
    return new Promise((resolve, reject) => {
        let objRet = {};

        if (status !== utils.OPERATION_STATUS.DELETE &&
            status !== utils.OPERATION_STATUS.SELECT ) {
            user['username'] = validator.trim(validator.escape(user['username'].toString() || ''));
            user['email'] = validator.trim(validator.escape(user['email'].toString() || ''));
            user['password'] = validator.trim(validator.escape(user['password'].toString() || ''));
            user['active'] = validator.trim(validator.escape(user['active'].toString() || '0'));


            if (validator.isNull(user['username']))
                objRet['username'] = 'Usuário é de preenchimento obrigatório.';

            if (validator.isNull(user['password']))
                objRet['password'] = 'Senha é de preenchimento obrigatório.';

            let emailNull = validator.isNull(user['email']);

            if (emailNull)
                objRet['email'] = 'Email é de preenchimento obrigatório.';

            if (!emailNull && (!validator.isEmail(user['email'])))
                objRet['email'] = 'Email informado não é válido.';

            let activeNull = validator.isNull(user['active']);

            if (!activeNull && (!validator.isIn(user['active'], [0, 1])))
                objRet['active'] = 'Status informado não é válido.';

            if (status === utils.OPERATION_STATUS.NEW) {
                user['passwordbis'] = validator.trim(validator.escape(user['passwordbis'].toString() || ''));
                if ((!validator.isNull(user['password'])) &&
                    (validator.isNull(user['passwordbis'])))
                    objRet['passwordbis'] = 'Confirmação da senha é de preenchimento obrigatório.';

                if ((!validator.isNull(user['passwordbis'])) &&
                    (!validator.isNull(user['password'])) &&
                    (!validator.equals(user['password'], user['passwordbis']))) {
                    objRet['passwordValid'] = 'Senhas não coincidem.';
                }
            }
        }

        if (status === utils.OPERATION_STATUS.UPDATE ||
            status === utils.OPERATION_STATUS.SELECT ||
            status === utils.OPERATION_STATUS.DELETE) {
            user['_id'] = validator.trim(validator.escape(user['_id'].toString() || ''));

            let idNull = validator.isNull(user['_id']);

            if (idNull)
                objRet['_id'] = 'Id do usuário é de preenchimento obrigatório.';

            if (!idNull && (!validator.isMongoId(user['_id'])))
                objRet['_id'] = 'Id do usuário informado é inválido.';
        }

        if (Object.keys(objRet).length !== 0) {
            reject(objRet);
        }
        else {
            resolve(user);
        }
    });

};


