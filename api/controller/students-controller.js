/**
 * Created by jonathan on 06/03/16.
 */
'use strict';
const studentsModel = require('../models/students-model');
const validator     = require('validator');
const utils         = require('../utils/utils');


// List all Students
module.exports.list = () => {
    return new Promise( (resolve, reject) => {
        studentsModel.students.find({})
            .exec()
            .then(resolve, reject)
    });
};

// Get Student By Id
module.exports.getById = (id) => {
    return new Promise( (resolve, reject) => {
        studentsModel.students.findById(id)
            .populate({
                path: 'courses._id',
                select: '-class -create_at -modified',
                populate: [
                    {
                        path: 'subjects.subject',
                        model: 'subjects',
                        select: 'description'
                    },
                    {
                        path: 'subjects.teacher',
                        model: 'teachers',
                        select: 'name'
                    }]
            })
            .exec()
            .then(resolve, reject)
    });
};

module.exports.getByList =  (list) => {
    return new Promise( (resolve, reject) => {
        let query = {
            '_id': {
                $in: list
            }
        };
        studentsModel.students.find(query)
            .exec()
            .then(resolve, reject)
    });

};

// Remove Student By Id
module.exports.removeById = (id) => {
    return new Promise( (resolve, reject) => {
        studentsModel.students.findByIdAndRemove(id)
            .exec()
            .then(resolve, reject)
    });

};

// Create a Student
module.exports.create = (student) => {
    return new Promise( (resolve, reject) => {
        new studentsModel.students({
            'identify': student['identify'],
            'name': student['name'],
            'gender': student['gender'],
            'dob': student['dob'],
            'active': student['active'],
            'social_number': student['social_number']
        }).save()
            .then(resolve, reject)
    });
};

// Update a Student
module.exports.update =  (student) => {
    return new Promise( (resolve, reject) => {
        let query = { _id: student['_id'] };
        let data = {
            'identify': student['identify'],
            'name': student['name'],
            'gender': student['gender'],
            'dob': student['dob'],
            'active': student['active'],
            'social_number': student['social_number']
        };

        studentsModel.students.findOneAndUpdate(query, data, { upsert: false, new: true })
            .exec()
            .then(resolve, reject)
    });
};

module.exports.validate =  (student, status) => {
    return new Promise( (resolve, reject) => {
        let objRet = {};

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

            if (validator.isNull(student['identify']))
                objRet['identify'] = 'Identificador é de preenchimento obrigatório.';

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

            let idNull = validator.isNull(student['_id']);

            if (idNull)
                objRet['_id'] = 'Id do Aluno é de preenchimento obrigatório.';

            if (!idNull && (!validator.isMongoId(student['_id'])))
                objRet['_id'] = 'Id do Aluno informado é inválido.';
        }

        if (Object.keys(objRet).length !== 0) {
            reject(objRet);
        }
        else {
            resolve(student);
        }

    });

};