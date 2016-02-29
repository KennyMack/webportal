/**
 * Created by jonathan on 21/02/16.
 */
var usersModel = require('../models/users-model');
var validator  = require('validator');
var utils      = require('../utils/utils');

// List all Users
module.exports.listUsers = function() {
    return usersModel.users.find({}).exec();
};

// Get User By Id
module.exports.getUserById = function(id){
    return usersModel.users.findById(id).exec();
};

// Get User By UserName
module.exports.getUserByUserName = function(username){
    return usersModel.users.findOne({ username: username }).exec();
};

// Get User By Email
module.exports.getUserByEmail = function(email){
    return usersModel.users.findOne({ email: email }).exec();
};

// Remove User By Id
module.exports.removeById = function(id) {
    return usersModel.users.findByIdAndRemove(id).exec();
};

// Create a new User
module.exports.createUser = function(user) {
    return new usersModel.users({
        'email': user['email'],
        'username': user['username'],
        'password': user['password']
    }).save();
};

// Update a User
module.exports.updateUser = function (user) {

    var query = { _id: user['_id'] };
    var data = {
        'username': user['username'],
        'password': user['password'],
        'email': user['email'],
        'active': user['active']
    };

    return usersModel.users.update(query, data, { upsert: false } ).exec();
};

// Update last Login
module.exports.updateLastLogin = function (id, callback) {
    var q = require('q');
    var deferred = q.defer();
    var query = {'_id': id };
    var data = {
        $set: {
            last_login: utils.getCurrentDateTime()
        }
    };
    var options = { upsert: true };

    usersModel.users.findOneAndUpdate(query, data, options, function (err, data) {
        if(err) {
            deferred.reject(err);
        }
        else{
            deferred.resolve(data);
        }
    });

    deferred.promise.nodeify(callback);
    return deferred.promise;
};

module.exports.validateUser = function (user, status) {

    var objRet = {};

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

        emailNull = validator.isNull(user['email']);
        if (emailNull)
            objRet['email'] = 'Email é de preenchimento obrigatório.';
        if (!emailNull && (!validator.isEmail(user['email'])))
            objRet['email'] = 'Email informado não é válido.';

        activeNull = validator.isNull(user['active']);
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

        var idNull = validator.isNull(user['_id']);

        if (idNull)
            objRet['_id'] = 'Id do usuário é de preenchimento obrigatório.';

        if (!idNull && (!validator.isMongoId(user['_id'])))
            objRet['_id'] = 'Id do usuário informado é inválido.';
    }

    return objRet;
};


