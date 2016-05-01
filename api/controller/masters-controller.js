/**
 * Created by jonathan on 28/04/16.
 */
'use strict';

const mastersModel = require('../models/masters-model');
const validator    = require('validator');
const utils        = require('../utils/utils');

// List all masters
module.exports.list = () => {
    return new Promise( (resolve, reject) => {
        mastersModel.masters.find({})
            .exec()
            .then(resolve, reject)
    });
};

// Get master By Id
module.exports.getById = (id) => {
    return new Promise( (resolve, reject) => {
        mastersModel.masters.findById(id)
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
        mastersModel.masters.find(query)
            .exec()
            .then(resolve, reject)
    });

};

// Remove master By Id
module.exports.removeById = (id) => {
    return new Promise( (resolve, reject) => {
        mastersModel.masters.findByIdAndRemove(id)
            .exec()
            .then(resolve, reject)
    });

};

// Create a master
module.exports.create = (master) => {
    return new Promise( (resolve, reject) => {
        new mastersModel.masters({
            'identify': master['identify'],
            'name': master['name'],
            'gender': master['gender'],
            'dob': master['dob'],
            'active': master['active'],
            'social_number': master['social_number']
        }).save()
            .then(resolve, reject)
    });
};

// Update a master
module.exports.update =  (master) => {
    return new Promise( (resolve, reject) => {
        let query = { _id: master['_id'] };
        let data = {
            'identify': master['identify'],
            'name': master['name'],
            'gender': master['gender'],
            'dob': master['dob'],
            'active': master['active'],
            'social_number': master['social_number']
        };

        mastersModel.masters.findOneAndUpdate(query, data, { upsert: false, new: true })
            .exec()
            .then(resolve, reject)
    });
};

module.exports.validate =  (master, status) => {
    return new Promise( (resolve, reject) => {
        let objRet = {};

        if (status !== utils.OPERATION_STATUS.DELETE &&
            status !== utils.OPERATION_STATUS.SELECT) {
            master['identify'] = validator.trim(validator.escape(master['identify'].toString() || ''));
            master['name'] = validator.trim(validator.escape(master['name'].toString() || ''));
            master['gender'] = validator.trim(validator.escape(master['gender'].toString() || ''));
            master['dob'] = validator.trim(master['dob'].toString() || '');
            master['social_number'] = validator.trim(validator.escape(master['social_number'].toString() || ''));
            master['active'] = validator.trim(validator.escape(master['active'].toString() || ''));

            if (validator.isNull(master['name']))
                objRet['name'] = 'Nome é de preenchimento obrigatório.';

            if (validator.isNull(student['identify']))
                objRet['identify'] = 'Identificador é de preenchimento obrigatório.';

            if (validator.isNull(master['gender']))
                objRet['gender'] = 'Sexo é de preenchimento obrigatório.';
            else if (!validator.isIn(master['gender'], ['M', 'F']))
                objRet['gender'] = 'Sexo informado não é válido.';

            if (validator.isNull(master['dob']))
                objRet['dob'] = 'Data de nascimento é de preenchimento obrigatório.';
            else if (!validator.isDate(master['dob']))
                objRet['dob'] = 'Data de nascimento informada não é válida.';

            if ((!validator.isNull(master['active'])) &&
                (!validator.isIn(master['active'], [0, 1])))
                objRet['active'] = 'Status informado não é válido.';


        }

        if (status === utils.OPERATION_STATUS.UPDATE ||
            status === utils.OPERATION_STATUS.SELECT ||
            status === utils.OPERATION_STATUS.DELETE) {
            console.log('OPERATION_STATUS.DELETE');

            master['_id'] = validator.trim(validator.escape(master['_id'].toString() || ''));

            let idNull = validator.isNull(master['_id']);

            if (idNull)
                objRet['_id'] = 'Id do administrador é de preenchimento obrigatório.';

            if (!idNull && (!validator.isMongoId(master['_id'])))
                objRet['_id'] = 'Id do administrador informado é inválido.';
        }

        if (Object.keys(objRet).length !== 0) {
            reject(objRet);
        }
        else {
            resolve(master);
        }

    });

};