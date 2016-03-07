/**
 * Created by jonathan on 06/03/16.
 */
var studentsModel = require('../models/students-model');
var validator       = require('validator');
var utils           = require('../utils/utils');


// List all Courses Type
module.exports.list = function() {
    return studentsModel.students.find({}).exec();
};

// Get Course Type By Id
module.exports.getById = function(id) {
    return studentsModel.students.findById(id).exec();
};

module.exports.getByList = function (list) {
    var query = {
        '_id': {
            $in: list
        }
    };
    return studentsModel.students.find(query).exec();
};

// Remove Course Type By Id
module.exports.removeById = function(id) {
    return studentsModel.students.findByIdAndRemove(id).exec();
};

// Create a Course Type
module.exports.create = function(student) {
    return new studentsModel.students({
        'identify': student['identify'],
        'name': student['name'],
        'gender': student['gender'],
        'dob': student['dob'],
        'active': student['active'],
        'social_number': student['social_number']
    }).save();
};

// Update a Course Type
module.exports.update = function (student) {

    var query = { _id: student['_id'] };
    var data = {
        'identify': student['identify'],
        'name': student['name'],
        'gender': student['gender'],
        'dob': student['dob'],
        'active': student['active'],
        'social_number': student['social_number']
    };

    return studentsModel.students.update(query, data, { upsert: false }).exec();
};

module.exports.validate = function (student, status) {
    var objRet = {};

    if (status !== utils.OPERATION_STATUS.DELETE &&
        status !== utils.OPERATION_STATUS.SELECT) {
        student['identify'] = validator.trim(validator.escape(student['identify'].toString() || ''));
        student['name'] = validator.trim(validator.escape(student['name'].toString() || ''));
        student['gender'] = validator.trim(validator.escape(student['gender'].toString() || ''));
        student['dob'] = validator.trim(student['dob'].toString() || '');
        student['social_number'] = validator.trim(validator.escape(student['social_number'].toString() || ''));
        student['active'] = validator.trim(validator.escape(student['active'].toString() || ''));

        if (validator.isNull(student['name']))
            objRet['name'] = 'Nome é de preenchimento obrigatório.';

        if (validator.isNull(student['gender']))
            objRet['gender'] = 'Sexo é de preenchimento obrigatório.';
        else if (!validator.isIn(student['gender'], ['M', 'F']))
            objRet['gender'] = 'Sexo informado não é válido.';

        if (validator.isNull(student['dob']))
            objRet['dob'] = 'Data de nascimento é de preenchimento obrigatório.';
        else if (!validator.isDate(student['dob']))
            objRet['dob'] = 'Data de nascimento informada não é válida.';

        if ((!validator.isNull(student['active'])) &&
            (!validator.isIn(student['active'], [0, 1])))
            objRet['active'] = 'Status informado não é válido.';


    }

    if (status === utils.OPERATION_STATUS.UPDATE ||
        status === utils.OPERATION_STATUS.SELECT ||
        status === utils.OPERATION_STATUS.DELETE) {
        console.log('OPERATION_STATUS.DELETE');

        student['_id'] = validator.trim(validator.escape(student['_id'].toString() || ''));

        var idNull = validator.isNull(student['_id']);

        if (idNull)
            objRet['_id'] = 'Id do Aluno é de preenchimento obrigatório.';

        if (!idNull && (!validator.isMongoId(student['_id'])))
            objRet['_id'] = 'Id do Aluno informado é inválido.';
    }

    return objRet;
};