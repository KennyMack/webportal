/**
 * Created by jonathan on 01/03/16.
 */
var coursesModel = require('../models/courses-model');
var validator   = require('validator');
var utils       = require('../utils/utils');


// List all Courses
module.exports.listCourses = function() {
    return coursesModel.courses.find({}).exec();
};

// Get Course By Id
module.exports.getById = function(id) {
    return coursesModel.courses.findById(id).exec();
};

// Remove Course By Id
module.exports.removeById = function(id) {
    return coursesModel.courses.findByIdAndRemove(id).exec();
};

// Create a Course
module.exports.createCourse = function(course) {
    return new coursesModel.courses({
        'identify': course['identify'],
        'description': course['description'],
        'duration': {
            'start': course['duration']['start'],
            'end': course['duration']['end']
        },
        course_type: {
            '_id': course['course_type']['_id'],
            'description': course['course_type']['description']
        }

    }).save();
};

// Update a Course
module.exports.updateCourse = function (course) {

    var query = { _id: course['_id'] };
    var data = {
        'identify': course['identify'],
        'description': course['description'],
        'duration': {
            'start': course['duration']['start'],
            'end': course['duration']['end']
        },
        'course_type': course['course_type']['description']
    };

    return coursesModel.courses.update(query, data, { upsert: false }).exec();
};

// Validate Subject
var validateSubject = function (subject) {
    subject['_id'] = validator.trim(validator.escape(subject['_id'].toString() || ''));
    subject['teacher'] = validator.trim(validator.escape(subject['idparent'].toString() || ''));
    subject['subject'] = validator.trim(validator.escape(subject['subject'].toString() || ''));

    var objRet = {};

    if (validator.isNull(subject['teacher']))
        objRet['teacher'] = 'Professor é de preenchimento obrigatório.';
    else if (!validator.isMongoId(subject['teacher']))
        objRet['teacher'] = 'Professor informado é inválido.';

    if (validator.isNull(subject['subject']))
        objRet['subject'] = 'Id da pessoa é de preenchimento obrigatório.';
    else if (!validator.isMongoId(subject['subject']))
        objRet['subject'] = 'Id da pessoa informado é inválido.';

    if (validator.isNull(subject['_id']))
        objRet['_id'] = 'Id do Curso é de preenchimento obrigatório.';
    else if (!validator.isMongoId(subject['_id']))
        objRet['_id'] = 'Id do Curso informado é inválido.';

    return objRet;
};

// Add subjects to Course
module.exports.addSubject = function(subject, callback) {
    var q = require('q');
    var deferred = q.defer();

    var objRet = validateSubject(subject);

    if (Object.keys(objRet).length !== 0) {
        deferred.reject(objRet);
    }
    else {
        var query = {_id: subject['_id']};
        var data = {
            $push: {
                "subjects": {
                    teacher: subject['teacher'],
                    subject: subject['subject']
                }
            }
        };
        var options = { safe: true, upsert: true, new: true };
        coursesModel.courses.findOneAndUpdate(query, data, options, function (err, data) {
            if (err) {
                deferred.reject(err);
            }
            else {
                deferred.resolve(data);
            }
        });
    }

    deferred.promise.nodeify(callback);
    return deferred.promise;
};

// Remove subjects to Course
module.exports.removeSubject = function(subject, callback) {
    var q = require('q');
    var deferred = q.defer();

    var objRet = validateSubject(subject);

    if (Object.keys(objRet).length !== 0) {
        deferred.reject(objRet);
    }
    else {
        var query = { _id: subject['_id'] };
        var data = {
            $pull: {
                "subjects": {
                    teacher: subject['teacher'],
                    subject: subject['subject']
                }
            }
        };
        var options = { safe: true, upsert: true, new: true };
        coursesModel.courses.findOneAndUpdate(query, data, options, function (err, data) {
            if (err) {
                deferred.reject(err);
            }
            else {
                deferred.resolve(data);
            }
        });
    }

    deferred.promise.nodeify(callback);
    return deferred.promise;
};

// Validate fields
module.exports.validateCourse = function (course, status) {
    var objRet = {};

    if (status !== utils.OPERATION_STATUS.DELETE &&
        status !== utils.OPERATION_STATUS.SELECT) {
        course['description'] = validator.trim(validator.escape(course['description'].toString() || ''));
        course['identify']  = validator.trim(validator.escape(course['identify'].toString() || ''));
        course['description']  = validator.trim(validator.escape(course['description'].toString() || ''));
        course['duration']['start']  = validator.trim(validator.escape(course['duration']['start'].toString() || ''));
        course['duration']['end']  = validator.trim(validator.escape(course['duration']['end'].toString() || ''));
        course['course_type']['_id']  = validator.trim(validator.escape(course['course_type']['_id'].toString() || ''));
        course['course_type']['description']  = validator.trim(validator.escape(course['course_type']['description'].toString() || ''));

        if (validator.isNull(course['description']))
            objRet['description'] = 'Descrição é de preenchimento obrigatório.';

        if (validator.isNull(course['duration']['start']))
            objRet['start'] = 'Data de início é de preenchimento obrigatório.';
        else if (!utils.isDate(course['duration']['start']))
            objRet['start'] = 'Data de início informada não é válida.';

        if (validator.isNull(course['duration']['end']))
            objRet['end'] = 'Data de término é de preenchimento obrigatório.';
        else if (!utils.isDate(course['duration']['end']))
            objRet['end'] = 'Data de término informada não é válida.';

        if (validator.isNull(course['course_type']['description']))
            objRet['course_type_description'] = 'Tipo do curso é de preenchimento obrigatório.';

        if (validator.isNull(course['course_type']['_id']))
            objRet['course_type__id'] = 'id do Tipo do curso é de preenchimento obrigatório.';
        else if (!validator.isMongoId(course['course_type']['_id']))
            objRet['course_type__id'] = 'id do Tipo do curso informado não é válida.';
    }

    if (status === utils.OPERATION_STATUS.UPDATE ||
        status === utils.OPERATION_STATUS.SELECT ||
        status === utils.OPERATION_STATUS.DELETE) {
        course['_id'] = validator.trim(validator.escape(course['_id'].toString() || ''));

        var idNull = validator.isNull(course['_id']);

        if (idNull)
            objRet['_id'] = 'Id do curso é de preenchimento obrigatório.';

        if (!idNull && (!validator.isMongoId(course['_id'])))
            objRet['_id'] = 'Id do curso informado é inválido.';
    }

    return objRet;
};