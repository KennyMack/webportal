/**
 * Created by jonathan on 28/04/16.
 */
'use strict';

const managersModel = require('../models/managers-model');
const validator     = require('validator');
const utils         = require('../utils/utils');

// List all managers
module.exports.list = () => {
    return new Promise( (resolve, reject) => {
        managersModel.managers.find({})
            .exec()
            .then(resolve, reject)
    });
};

// Get managers By Id
module.exports.getById = (id) => {
    return new Promise( (resolve, reject) => {
        managersModel.managers.findById(id)
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
        managersModel.managers.find(query)
            .exec()
            .then(resolve, reject)
    });

};

// Remove managers By Id
module.exports.removeById = (id) => {
    return new Promise( (resolve, reject) => {
        managersModel.managers.findByIdAndRemove(id)
            .exec()
            .then(resolve, reject)
    });

};

// Create a managers
module.exports.create = (manager) => {
    return new Promise( (resolve, reject) => {
        new managersModel.managers({
            'identify': manager['identify'],
            'name': manager['name'],
            'gender': manager['gender'],
            'dob': manager['dob'],
            'active': manager['active'],
            'social_number': manager['social_number']
        }).save()
            .then(resolve, reject)
    });
};

// Update a managers
module.exports.update =  (manager) => {
    return new Promise( (resolve, reject) => {
        let query = { _id: manager['_id'] };
        let data = {
            'identify': manager['identify'],
            'name': manager['name'],
            'gender': manager['gender'],
            'dob': manager['dob'],
            'active': manager['active'],
            'social_number': manager['social_number']
        };

        managersModel.managers.findOneAndUpdate(query, data, { upsert: false, new: true })
            .exec()
            .then(resolve, reject)
    });
};

module.exports.validate =  (manager, status) => {
    return new Promise( (resolve, reject) => {
        let objRet = {};

        if (status !== utils.OPERATION_STATUS.DELETE &&
            status !== utils.OPERATION_STATUS.SELECT) {
            manager['identify'] = validator.trim(validator.escape(manager['identify'].toString() || ''));
            manager['name'] = validator.trim(validator.escape(manager['name'].toString() || ''));
            manager['gender'] = validator.trim(validator.escape(manager['gender'].toString() || ''));
            manager['dob'] = validator.trim(manager['dob'].toString() || '');
            manager['social_number'] = validator.trim(validator.escape(manager['social_number'].toString() || ''));
            manager['active'] = validator.trim(validator.escape(manager['active'].toString() || ''));

            if (validator.isNull(manager['name']))
                objRet['name'] = 'Nome é de preenchimento obrigatório.';

            if (validator.isNull(manager['identify']))
                objRet['identify'] = 'Identificador é de preenchimento obrigatório.';

            if (validator.isNull(manager['gender']))
                objRet['gender'] = 'Sexo é de preenchimento obrigatório.';
            else if (!validator.isIn(manager['gender'], ['M', 'F']))
                objRet['gender'] = 'Sexo informado não é válido.';

            if (validator.isNull(manager['dob']))
                objRet['dob'] = 'Data de nascimento é de preenchimento obrigatório.';
            else if (!validator.isDate(manager['dob']))
                objRet['dob'] = 'Data de nascimento informada não é válida.';

            if ((!validator.isNull(manager['active'])) &&
                (!validator.isIn(manager['active'], [0, 1])))
                objRet['active'] = 'Status informado não é válido.';

        }

        if (status === utils.OPERATION_STATUS.UPDATE ||
            status === utils.OPERATION_STATUS.SELECT ||
            status === utils.OPERATION_STATUS.DELETE) {
            console.log('OPERATION_STATUS.DELETE');

            manager['_id'] = validator.trim(validator.escape(manager['_id'].toString() || ''));

            let idNull = validator.isNull(manager['_id']);

            if (idNull)
                objRet['_id'] = 'Id do diretor é de preenchimento obrigatório.';

            if (!idNull && (!validator.isMongoId(manager['_id'])))
                objRet['_id'] = 'Id do diretor informado é inválido.';
        }

        if (Object.keys(objRet).length !== 0) {
            reject(objRet);
        }
        else {
            resolve(manager);
        }

    });

};