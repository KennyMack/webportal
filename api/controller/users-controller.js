/**
 * Created by jonathan on 21/02/16.
 */
var usersModel = require('../models/users-model');
var bcrypt = require('bcrypt');
var validator = require('validator');
var utils = require('../utils/utils');

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

// Remove User By Id
module.exports.removeById = function(id) {
    return usersModel.users.findByIdAndRemove(id).exec();
};

// Create a new User
module.exports.createUser = function(user) {
    return new usersModel.users({
        'username': user['username'],
        'name': user['name'],
        'password': user['password']
    }).save();
};

// Update a User
module.exports.updateUser = function (user) {

    var query = { _id: user['_id'] };
    var data = {
        'username': user['username'],
        'name': user['name'],
        'password': user['password']
    };


    return usersModel.users.update(query, data, { upsert: false } ).exec();

};

module.exports.validateUser = function (user, status) {
    user['username'] = validator.trim(validator.escape(user['username'] || ''));
    user['name'] = validator.trim(validator.escape(user['name'] || ''));
    user['password'] = validator.trim(validator.escape(user['password'] || ''));

    var objRet = {};
    if (validator.isNull(user['username']))
        objRet['username'] = 'Usuário é de preenchimento obrigatório.';
    if (validator.isNull(user['name']))
        objRet['name'] = 'Nome é de preenchimento obrigatório.';
    if (validator.isNull(user['password']))
        objRet['password'] = 'Senha é de preenchimento obrigatório.';


    if (status === utils.OPERATION_STATUS.NEW) {
        user['passwordbis'] = validator.trim(validator.escape(user['passwordbis'] || ''));
        if ((!validator.isNull(user['password'])) &&
            (validator.isNull(user['passwordbis'])))
            objRet['passwordbis'] = 'Confirmação da senha é de preenchimento obrigatório.';

        if ((!validator.isNull(user['passwordbis'])) &&
            (!validator.isNull(user['password'])) &&
            (!validator.equals(user['password'], user['passwordbis']))) {
            objRet['passwordValid'] = 'Senhas não coincidem.';
        }
    }
    if (status === utils.OPERATION_STATUS.UPDATE){
        user['_id'] = validator.trim(validator.escape(user['_id'] || ''));

        var idNull = validator.isNull(user['_id']);

        if (idNull)
            objRet['_id'] = 'Id do usuário é de preenchimento obrigatório.';

        if (!idNull && (!validator.isMongoId(user['_id'])))
            objRet['_id'] = 'Id do usuário informado é inválido.';

    }

    return objRet;
};


module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch){
        if (err) return callback(err);
        callback(null, isMatch);
    });
};