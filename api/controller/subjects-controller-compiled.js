/**
 * Created by jonathan on 03/03/16.
 */

'use strict';

var subjectsModel = require('../models/subjects-model');
var validator = require('validator');
var utils = require('../utils/utils');

// List all Teachers
module.exports.list = function () {
    return new Promise(function (resolve, reject) {
        subjectsModel.subjects.find({}).exec().then(resolve, reject);
    });
};

// Get Teacher By Id
module.exports.getById = function (id) {
    return new Promise(function (resolve, reject) {
        subjectsModel.subjects.findById(id).exec().then(resolve, reject);
    });
};

// Remove Teacher By Id
module.exports.removeById = function (id) {
    return new Promise(function (resolve, reject) {
        subjectsModel.subjects.findByIdAndRemove(id).exec().then(resolve, reject);
    });
};

// Create a Teacher
module.exports.create = function (subject) {
    return new Promise(function (resolve, reject) {
        new subjectsModel.subjects({
            'description': subject['description']
        }).save().then(resolve, reject);
    });
};

// Update a Teacher
module.exports.update = function (subject) {
    return new Promise(function (resolve, reject) {

        var query = { _id: subject['_id'] };
        var data = {
            'description': subject['description']
        };

        subjectsModel.subjects.update(query, data, { upsert: false }).exec().then(resolve, reject);
    });
};

// Validate fields
module.exports.validate = function (subject, status) {
    return new Promise(function (resolve, reject) {

        var objRet = {};

        if (status !== utils.OPERATION_STATUS.DELETE && status !== utils.OPERATION_STATUS.SELECT) {
            subject['description'] = validator.trim(validator.escape(subject['description'].toString() || ''));

            if (validator.isNull(subject['description'])) objRet['description'] = 'Descrição é de preenchimento obrigatório.';
        }

        if (status === utils.OPERATION_STATUS.UPDATE || status === utils.OPERATION_STATUS.SELECT || status === utils.OPERATION_STATUS.DELETE) {
            subject['_id'] = validator.trim(validator.escape(subject['_id'].toString() || ''));

            var idNull = validator.isNull(subject['_id']);

            if (idNull) objRet['_id'] = 'Id da matéria é de preenchimento obrigatório.';

            if (!idNull && !validator.isMongoId(subject['_id'])) objRet['_id'] = 'Id da matéria informado não é válido.';
        }
        if (Object.keys(objRet).length !== 0) {
            reject(objRet);
        } else {
            resolve(subject);
        }
    });
};

//# sourceMappingURL=subjects-controller-compiled.js.map