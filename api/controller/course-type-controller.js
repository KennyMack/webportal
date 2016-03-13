/**
 * Created by jonathan on 01/03/16.
 */
var courseTypeModel = require('../models/course-type-model');
var validator       = require('validator');
var utils           = require('../utils/utils');


// List all Courses Type
module.exports.listCoursesType = function() {
    return courseTypeModel.courseType.find({}).exec();
};

// Get Course Type By Id
module.exports.getById = function(id) {
    return courseTypeModel.courseType.findById(id).exec();
};

// Remove Course Type By Id
module.exports.removeById = function(id) {
    return courseTypeModel.courseType.findByIdAndRemove(id).exec();
};

// Create a Course Type
module.exports.createCourseType = function(courseType) {
    return new courseTypeModel.courseType({
        'description': courseType['description']
    }).save();
};

// Update a Course Type
module.exports.updateCourseType = function (courseType) {

    var query = { _id: courseType['_id'] };
    var data = {
        'description': courseType['description']
    };

    return courseTypeModel.courseType.update(query, data, { upsert: false }).exec();
};

module.exports.validateCourseType = function (courseType, status) {
    var objRet = {};

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

        var idNull = validator.isNull(courseType['_id']);

        if (idNull)
            objRet['_id'] = 'Id do Tipo do curso é de preenchimento obrigatório.';

        if (!idNull && (!validator.isMongoId(courseType['_id'])))
            objRet['_id'] = 'Id do Tipo do curso informado é inválido.';
    }

    return objRet;
};