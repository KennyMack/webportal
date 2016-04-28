/**
 * Created by jonathan on 01/03/16.
 */
'use strict';

const courseTypeModel = require('../models/course-type-model');
const validator       = require('validator');
const utils           = require('../utils/utils');

// List all Courses Type
module.exports.listCoursesType = () => {
    return new Promise( (resolve, reject) => {
        courseTypeModel.courseType.find({})
            .exec()
            .then(resolve, reject);
    });

};

// Get Course Type By Id
module.exports.getById = (id) => {
    return new Promise( (resolve, reject) => {
        courseTypeModel.courseType.findById(id)
            .exec()
            .then(resolve, reject);
    });
};

// Remove Course Type By Id
module.exports.removeById = (id) => {
    return new Promise( (resolve, reject) => {
        courseTypeModel.courseType.findByIdAndRemove(id)
            .exec()
            .then(resolve, reject);
    });
};

// Create a Course Type
module.exports.createCourseType = (courseType) => {
    return new Promise( (resolve, reject) => {
        new courseTypeModel.courseType({
            'description': courseType['description']
        }).save()
            .then(resolve, reject);
    });
};

// Update a Course Type
module.exports.updateCourseType =  (courseType) => {
    return new Promise( (resolve, reject) => {
        let query = {_id: courseType['_id']};
        let data = {
            'description': courseType['description']
        };

        courseTypeModel.courseType.update(query, data, { upsert: false, new: true })
            .exec()
            .then(resolve, reject);
    });
};

module.exports.validateCourseType =  (courseType, status) => {
    return new Promise( (resolve, reject) => {
        let objRet = {};

        if (status !== utils.OPERATION_STATUS.DELETE &&
            status !== utils.OPERATION_STATUS.SELECT) {
            courseType['description'] = validator.trim(validator.escape(courseType['description'].toString() || ''));

            if (validator.isNull(courseType['description']))
                objRet['description'] = 'Descrição é de preenchimento obrigatório.';

        }

        if (status === utils.OPERATION_STATUS.UPDATE ||
            status === utils.OPERATION_STATUS.SELECT ||
            status === utils.OPERATION_STATUS.DELETE) {
            courseType['_id'] = validator.trim(validator.escape(courseType['_id'].toString() || ''));

            let idNull = validator.isNull(courseType['_id']);

            if (idNull)
                objRet['_id'] = 'Id do Tipo do curso é de preenchimento obrigatório.';

            if (!idNull && (!validator.isMongoId(courseType['_id'])))
                objRet['_id'] = 'Id do Tipo do curso informado é inválido.';
        }

        if (Object.keys(objRet).length !== 0) {
            reject(objRet);
        }
        else {
            resolve(courseType);
        }
    });
};