/**
 * Created by jonathan on 03/03/16.
 */
var subjectsModel = require('../models/subjects-model');
var validator     = require('validator');
var utils         = require('../utils/utils');


// List all Teachers
module.exports.list = function() {
    return subjectsModel.subjects.find({}).exec();
};

// Get Teacher By Id
module.exports.getById = function(id) {
    return subjectsModel.subjects.findById(id).exec();
};

// Remove Teacher By Id
module.exports.removeById = function(id) {
    return subjectsModel.subjects.findByIdAndRemove(id).exec();
};

// Create a Teacher
module.exports.create = function(subject) {
    return new subjectsModel.subjects({
        'description': subject['description']
    }).save();
};

// Update a Teacher
module.exports.update = function (subject) {

    var query = { _id: subject['_id'] };
    var data = {
        'description': subject['description']
    };

    return subjectsModel.subjects.update(query, data, { upsert: false }).exec();
};

// Validate fields
module.exports.validate = function (subject, status) {
    var objRet = {};

    if (status !== utils.OPERATION_STATUS.DELETE &&
        status !== utils.OPERATION_STATUS.SELECT) {
        subject['description'] = validator.trim(validator.escape(subject['description'].toString() || ''));

        if (validator.isNull(subject['description']))
            objRet['description'] = 'Descrição é de preenchimento obrigatório.';

    }

    if (status === utils.OPERATION_STATUS.UPDATE ||
        status === utils.OPERATION_STATUS.SELECT ||
        status === utils.OPERATION_STATUS.DELETE) {
        subject['_id'] = validator.trim(validator.escape(subject['_id'].toString() || ''));

        var idNull = validator.isNull(subject['_id']);

        if (idNull)
            objRet['_id'] = 'Id da matéria é de preenchimento obrigatório.';

        if (!idNull && (!validator.isMongoId(subject['_id'])))
            objRet['_id'] = 'Id da matéria informado não é válido.';
    }

    return objRet;
};