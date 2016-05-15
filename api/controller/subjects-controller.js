/**
 * Created by jonathan on 03/03/16.
 */

'use strict';

const subjectsModel = require('../models/subjects-model');
const validator     = require('validator');
const utils         = require('../utils/utils');

// List all Teachers
module.exports.list = () => {
    return new Promise( (resolve, reject) => {
        subjectsModel.subjects.find({})
        .exec()
        .then(resolve, reject);
    });
};

// Get Teacher By Id
module.exports.getById = (id) => {
    return new Promise( (resolve, reject) => {
        subjectsModel.subjects.findById(id)
            .exec()
            .then(resolve, reject);
    });
};

// Remove Teacher By Id
module.exports.removeById = (id) => {
    return new Promise( (resolve, reject) => {
        subjectsModel.subjects.findByIdAndRemove(id)
            .exec()
            .then(resolve, reject);
    });

};

// Create a Teacher
module.exports.create = (subject) => {
    return new Promise( (resolve, reject) => {
        new subjectsModel.subjects({
            'description': subject['description']
        }).save()
            .then(resolve, reject);
    });
};

// Update a Teacher
module.exports.update =  (subject) => {
    return new Promise( (resolve, reject) => {

        let query = { _id: subject['_id'] };
        let data = {
            'description': subject['description']
        };

        subjectsModel.subjects.update(query, data, { upsert: false })
            .exec()
            .then(resolve, reject);
    });
};

// Validate fields
module.exports.validate =  (subject, status) => {
    return new Promise( (resolve, reject) => {

        let objRet = {};

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

            let idNull = validator.isNull(subject['_id']);

            if (idNull)
                objRet['_id'] = 'Id da matéria é de preenchimento obrigatório.';

            if (!idNull && (!validator.isMongoId(subject['_id'])))
                objRet['_id'] = 'Id da matéria informado não é válido.';
        }
        if (Object.keys(objRet).length !== 0) {
            reject(objRet)
        }
        else {
            resolve(subject);
        }


    });
};