/**
 * Created by jonathan on 03/03/16.
 */
var teachersModel = require('../models/teachers-model');
var validator     = require('validator');
var utils         = require('../utils/utils');


// List all Teachers
module.exports.listTeachers = function() {
    return teachersModel.teachers.find({}).exec();
};

// Get Teacher By Id
module.exports.getById = function(id) {
    return teachersModel.teachers.findById(id).exec();
};

// Remove Teacher By Id
module.exports.removeById = function(id) {
    return teachersModel.teachers.findByIdAndRemove(id).exec();
};

// Create a Teacher
module.exports.createTeacher = function(teacher) {
    return new teachersModel.teachers({
        'identify': teacher['identify'],
        'name': teacher['name'],
        'gender': teacher['gender'],
        'dob': teacher['dob'],
        'active': teacher['active'],
        'social_number': teacher['social_number']
    }).save();
};

// Update a Teacher
module.exports.updateTeacher = function (teacher) {

    var query = { _id: teacher['_id'] };
    var data = {
        'identify': teacher['identify'],
        'name': teacher['name'],
        'gender': teacher['gender'],
        'dob': teacher['dob'],
        'active': teacher['active'],
        'social_number': teacher['social_number']
    };

    return teachersModel.teachers.update(query, data, { upsert: false }).exec();
};

// Validate fields
module.exports.validateTeacher = function (teacher, status) {
    var objRet = {};

    if (status !== utils.OPERATION_STATUS.DELETE &&
        status !== utils.OPERATION_STATUS.SELECT) {
        teacher['identify'] = validator.trim(validator.escape(teacher['identify'].toString() || ''));
        teacher['name'] = validator.trim(validator.escape(teacher['name'].toString() || ''));
        teacher['gender'] = validator.trim(validator.escape(teacher['gender'].toString() || ''));
        teacher['dob'] = validator.trim(teacher['dob'].toString() || '');
        teacher['social_number'] = validator.trim(validator.escape(teacher['social_number'].toString() || ''));
        teacher['active'] = validator.trim(validator.escape(teacher['active'].toString() || ''));

        if (validator.isNull(teacher['name']))
            objRet['name'] = 'Nome é de preenchimento obrigatório.';

        if (validator.isNull(teacher['gender']))
            objRet['gender'] = 'Sexo é de preenchimento obrigatório.';
        else if (!validator.isIn(teacher['gender'], ['M', 'F']))
            objRet['gender'] = 'Sexo informado não é válido.';

        if (validator.isNull(teacher['dob']))
            objRet['dob'] = 'Data de nascimento é de preenchimento obrigatório.';
        else if (!validator.isDate(teacher['dob']))
            objRet['dob'] = 'Data de nascimento informada não é válida.';

        if ((!validator.isNull(teacher['active'])) &&
            (!validator.isIn(teacher['active'], [0, 1])))
            objRet['active'] = 'Status informado não é válido.';


    }

    if (status === utils.OPERATION_STATUS.UPDATE ||
        status === utils.OPERATION_STATUS.SELECT ||
        status === utils.OPERATION_STATUS.DELETE) {
        teacher['_id'] = validator.trim(validator.escape(teacher['_id'].toString() || ''));

        var idNull = validator.isNull(teacher['_id']);

        if (idNull)
            objRet['_id'] = 'Id do professor é de preenchimento obrigatório.';

        if (!idNull && (!validator.isMongoId(teacher['_id'])))
            objRet['_id'] = 'Id do professor informado não é válido.';
    }

    return objRet;
};