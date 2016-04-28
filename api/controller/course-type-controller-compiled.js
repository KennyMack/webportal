/**
 * Created by jonathan on 01/03/16.
 */
'use strict';

var courseTypeModel = require('../models/course-type-model');
var validator = require('validator');
var utils = require('../utils/utils');

// List all Courses Type
module.exports.listCoursesType = function () {
    return new Promise(function (resolve, reject) {
        courseTypeModel.courseType.find({}).exec().then(resolve, reject);
    });
};

// Get Course Type By Id
module.exports.getById = function (id) {
    return new Promise(function (resolve, reject) {
        courseTypeModel.courseType.findById(id).exec().then(resolve, reject);
    });
};

// Remove Course Type By Id
module.exports.removeById = function (id) {
    return new Promise(function (resolve, reject) {
        courseTypeModel.courseType.findByIdAndRemove(id).exec().then(resolve, reject);
    });
};

// Create a Course Type
module.exports.createCourseType = function (courseType) {
    return new Promise(function (resolve, reject) {
        new courseTypeModel.courseType({
            'description': courseType['description']
        }).save().then(resolve, reject);
    });
};

// Update a Course Type
module.exports.updateCourseType = function (courseType) {
    return new Promise(function (resolve, reject) {
        var query = { _id: courseType['_id'] };
        var data = {
            'description': courseType['description']
        };

        courseTypeModel.courseType.update(query, data, { upsert: false, new: true }).exec().then(resolve, reject);
    });
};

module.exports.validateCourseType = function (courseType, status) {
    return new Promise(function (resolve, reject) {
        var objRet = {};

        if (status !== utils.OPERATION_STATUS.DELETE && status !== utils.OPERATION_STATUS.SELECT) {
            courseType['description'] = validator.trim(validator.escape(courseType['description'].toString() || ''));

            if (validator.isNull(courseType['description'])) objRet['description'] = 'Descrição é de preenchimento obrigatório.';
        }

        if (status === utils.OPERATION_STATUS.UPDATE || status === utils.OPERATION_STATUS.SELECT || status === utils.OPERATION_STATUS.DELETE) {
            courseType['_id'] = validator.trim(validator.escape(courseType['_id'].toString() || ''));

            var idNull = validator.isNull(courseType['_id']);

            if (idNull) objRet['_id'] = 'Id do Tipo do curso é de preenchimento obrigatório.';

            if (!idNull && !validator.isMongoId(courseType['_id'])) objRet['_id'] = 'Id do Tipo do curso informado é inválido.';
        }

        if (Object.keys(objRet).length !== 0) {
            reject(objRet);
        } else {
            resolve(courseType);
        }
    });
};

//# sourceMappingURL=course-type-controller-compiled.js.map