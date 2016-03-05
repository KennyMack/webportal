/**
 * Created by jonathan on 01/03/16.
 */
var coursesModel = require('../models/courses-model');
var validator   = require('validator');
var utils       = require('../utils/utils');
var q           = require('q');
var moment      = require('moment');
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
        'active': course['active'],
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
        'active': course['active'],
        'duration': {
            'start': course['duration']['start'],
            'end': course['duration']['end']
        },
        'course_type':  {
            '_id': course['course_type']['_id'],
            'description': course['course_type']['description']
        }
    };

    return coursesModel.courses.update(query, data, { upsert: false }).exec();
};

// Validate Subject
var validateSubject = function (subject, status) {
    var objRet = {};
    if (status === utils.OPERATION_STATUS.NEW) {

        subject['teacher'] = validator.trim(validator.escape(subject['teacher'].toString() || ''));
        subject['subject'] = validator.trim(validator.escape(subject['subject'].toString() || ''));


        if (validator.isNull(subject['teacher']))
            objRet['teacher'] = 'Professor é de preenchimento obrigatório.';
        else if (!validator.isMongoId(subject['teacher']))
            objRet['teacher'] = 'Professor informado é inválido.';

        if (validator.isNull(subject['subject']))
            objRet['subject'] = 'Id da pessoa é de preenchimento obrigatório.';
        else if (!validator.isMongoId(subject['subject']))
            objRet['subject'] = 'Id da pessoa informado é inválido.';


    }
    if (status === utils.OPERATION_STATUS.DELETE){
        subject['_idsubject'] = validator.trim(validator.escape(subject['_idsubject'].toString() || ''));
        if (validator.isNull(subject['_idsubject']))
            objRet['_idsubject'] = 'Id da materia é de preenchimento obrigatório.';
        else if (!validator.isMongoId(subject['_idsubject']))
            objRet['_idsubject'] = 'Id da materia informado é inválido.';
    }

    subject['_id'] = validator.trim(validator.escape(subject['_id'].toString() || ''));
    if (validator.isNull(subject['_id']))
        objRet['_id'] = 'Id do Curso é de preenchimento obrigatório.';
    else if (!validator.isMongoId(subject['_id']))
        objRet['_id'] = 'Id do Curso informado é inválido.';

    return objRet;
};

// Add subjects to Course
module.exports.addSubject = function(subject, callback) {
    var deferred = q.defer();

    var objRet = validateSubject(subject, utils.OPERATION_STATUS.NEW);

    if (Object.keys(objRet).length !== 0) {
        deferred.reject(objRet);
    }
    else {
        var query = {
            $and: [
                {
                    _id: subject['_id']
                },
                {
                    "subjects.subject": subject['subject']
                }
            ]
        };

        coursesModel.courses.find(query, function (err, course) {
            if (err)
                deferred.reject(err);
            else {
                if (course.length === 0){
                    query = {_id: subject['_id']};

                    var data = {
                        $push: {
                            "subjects": {
                                teacher: subject['teacher'],
                                subject: subject['subject']
                            }
                        }
                    };
                    var options = {safe: true, upsert: true, new: true};
                    coursesModel.courses.findOneAndUpdate(query, data, options, function (err, data) {
                        if (err) {
                            deferred.reject(err);
                        }
                        else {
                            deferred.resolve(data);
                        }
                    });
                }
                else {
                    deferred.reject({ subject : "Matéria já vinculada neste curso." });
                }
            }
        });
    }

    deferred.promise.nodeify(callback);
    return deferred.promise;
};

// Remove subjects of Course
module.exports.removeSubject = function(subject, callback) {
    var deferred = q.defer();

    var objRet = validateSubject(subject, utils.OPERATION_STATUS.DELETE);

    if (Object.keys(objRet).length !== 0) {
        deferred.reject(objRet);
    }
    else {
        var query = { _id: subject['_id'] };
        var data = {
            $pull: {
                "subjects": {
                    _id: subject['_idsubject']
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

// Validate Schedule
var validateSchedule = function (item, status) {
    var objRet = {};
    if (status === utils.OPERATION_STATUS.NEW ||
        status === utils.OPERATION_STATUS.UPDATE) {
        item['day'] = validator.trim(validator.escape(item['day'].toString() || ''));
        item['subject'] = validator.trim(validator.escape(item['subject'].toString() || ''));
        item['duration']['start']  = validator.trim(item['duration']['start'].toString() || '');
        item['duration']['end']  = validator.trim(item['duration']['end'].toString() || '');

        console.log(item);

        if (validator.isNull(item['subject']))
            objRet['subject'] = 'Id da matéria é de preenchimento obrigatório.';
        else if (!validator.isMongoId(item['subject']))
            objRet['subject'] = 'Id da matéria informado é inválido.';

        if (validator.isNull(item['day']))
            objRet['day'] = 'Dia da semana é de preenchimento obrigatório.';
        else if (!validator.isInt(item['day']))
            objRet['day'] = 'Dia da semana informado é inválido.';
        else if (!validator.isIn(item['day'], [1, 2, 3, 4, 5, 6, 7]))
            objRet['day'] = 'Dia da semana informado é inválido.';

        if (validator.isNull(item['duration']['start']))
            objRet['start'] = 'Data de início é de preenchimento obrigatório.';
        else if (!validator.isDate(item['duration']['start']))
            objRet['start'] = 'Data de início informada não é válida.';


        if (validator.isNull(item['duration']['end']))
            objRet['end'] = 'Data de término é de preenchimento obrigatório.';
        else if (!validator.isDate(item['duration']['end']))
            objRet['end'] = 'Data de término informada não é válida.';
    }
    if (status === utils.OPERATION_STATUS.DELETE){

        item['_idschedule'] = validator.trim(validator.escape(item['_idschedule'].toString() || ''));
        if (validator.isNull(item['_idschedule']))
            objRet['_idschedule'] = 'Id do item do cronograma é de preenchimento obrigatório.';
        else if (!validator.isMongoId(item['_idschedule']))
            objRet['_idschedule'] = 'Id do item do cronograma informado é inválido.';
    }

    item['_id'] = validator.trim(validator.escape(item['_id'].toString() || ''));
    if (validator.isNull(item['_id']))
        objRet['_id'] = 'Id do Curso é de preenchimento obrigatório.';
    else if (!validator.isMongoId(item['_id']))
        objRet['_id'] = 'Id do Curso informado é inválido.';

    return objRet;
};

module.exports.addSchedule = function (item, callback) {

    var deferred = q.defer();

    var objRet = validateSchedule(item, utils.OPERATION_STATUS.NEW);

    if (Object.keys(objRet).length !== 0) {
        deferred.reject(objRet);
    }
    else {
        coursesModel.courses.findById(item['_id']).exec()
            .then(function (course) {
                if (course) {
                    objRet = validateDateScheduleItem(item, course);

                    if (Object.keys(objRet).length !== 0) {
                        deferred.reject(objRet);
                    }
                    else {
                        course.schedule.push({
                            day: item['day'],
                            subject: item['subject'],
                            duration: {
                                start: moment(item['duration']['start']).format('YYYY-MM-DD HH:mm:ss'),
                                end: moment(item['duration']['end']).format('YYYY-MM-DD HH:mm:ss')
                            }
                        });

                        course.save(function (err, course) {
                            if (err) {
                                deferred.reject(err);
                            } else {
                                deferred.resolve(course)
                            }
                        });
                    }
                }
                else
                    deferred.reject('404 - Not Found');
            },
            function (err) {
                deferred.reject(err);
            });
    }

    deferred.promise.nodeify(callback);
    return deferred.promise;
};

var validateDateScheduleItem = function (item, course) {
    var objRet = {};
    var candidateScheduleItem = {
        start: moment(item['duration']['start']).format('HH:mm:ss'),
        end: moment(item['duration']['end']).format('HH:mm:ss')
    };
    if (candidateScheduleItem.start > candidateScheduleItem.end) {
        objRet['duration'] = 'Período informado é inválido.';
    }
    else {

        for (var i = 0, length = course.schedule.length; i < length; i++) {
            if (course.schedule[i].day == item['day']) {

                var scheduleItem = {
                    start: moment(course.schedule[i].duration.start).format('HH:mm:ss'),
                    end: moment(course.schedule[i].duration.end).format('HH:mm:ss')
                };

                if (utils.betweenII(candidateScheduleItem.start, scheduleItem.start, scheduleItem.end)) {
                    objRet['start'] = 'Já existe outra matéria vinculada neste Horário.';
                }

                if (utils.betweenII(candidateScheduleItem.end, scheduleItem.start, scheduleItem.end)) {
                    objRet['end'] = 'Já existe outra matéria vinculada neste Horário.';
                }

                if (Object.keys(objRet).length !== 0) {
                    break;
                }

                scheduleItem = null;
            }
        }
    }
    candidateScheduleItem = null;

    return objRet;
};

// Remove subjects to Course
module.exports.removeSchedule = function(item, callback) {
    var deferred = q.defer();

    var objRet = validateSchedule(item, utils.OPERATION_STATUS.DELETE);

    if (Object.keys(objRet).length !== 0) {
        deferred.reject(objRet);
    }
    else {
        var query = { _id: item['_id'] };
        var data = {
            $pull: {
                "schedule": {
                    _id: item['_idschedule']
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
var validateCourse = function (course, status) {
    var objRet = {};

    if (status !== utils.OPERATION_STATUS.DELETE &&
        status !== utils.OPERATION_STATUS.SELECT) {
        course['identify']  = validator.trim(validator.escape(course['identify'].toString() || ''));
        course['active']  = validator.trim(validator.escape(course['active'].toString() || ''));
        course['description']  = validator.trim(validator.escape(course['description'].toString() || ''));
        course['duration']['start']  = validator.trim(course['duration']['start'].toString() || '');
        course['duration']['end']  = validator.trim(course['duration']['end'].toString() || '');
        course['course_type']['_id']  = validator.trim(validator.escape(course['course_type']['_id'].toString() || ''));
        course['course_type']['description']  = validator.trim(validator.escape(course['course_type']['description'].toString() || ''));

        if (validator.isNull(course['description']))
            objRet['description'] = 'Descrição é de preenchimento obrigatório.';

        if (validator.isNull(course['duration']['start']))
            objRet['start'] = 'Data de início é de preenchimento obrigatório.';
        else if (!validator.isDate(course['duration']['start']))
            objRet['start'] = 'Data de início informada não é válida.';

        if (validator.isNull(course['duration']['end']))
            objRet['end'] = 'Data de término é de preenchimento obrigatório.';
        else if (!validator.isDate(course['duration']['end']))
            objRet['end'] = 'Data de término informada não é válida.';

        if (validator.isNull(course['course_type']['description']))
            objRet['course_type_description'] = 'Tipo do curso é de preenchimento obrigatório.';

        if (validator.isNull(course['course_type']['_id']))
            objRet['course_type__id'] = 'id do Tipo do curso é de preenchimento obrigatório.';
        else if (!validator.isMongoId(course['course_type']['_id']))
            objRet['course_type__id'] = 'id do Tipo do curso informado não é válida.';

        if ((!validator.isNull(course['active'])) && (!validator.isIn(course['active'], [0, 1])))
            objRet['active'] = 'Status informado não é válido.';

    }

    if (status === utils.OPERATION_STATUS.UPDATE ||
        status === utils.OPERATION_STATUS.SELECT ||
        status === utils.OPERATION_STATUS.DELETE) {
        course['_id'] = validator.trim(validator.escape(course['_id'].toString() || ''));

        var idNull = validator.isNull(course['_id']);

        if (idNull)
            objRet['_id'] = 'Id do curso é de preenchimento obrigatório.';
        else if (!validator.isMongoId(course['_id']))
            objRet['_id'] = 'Id do curso informado é inválido.';
    }

    return objRet;
};

// Validate Duration of course
var validateDate = function (course) {
    var objRet = {};
    if (course['duration']['start'] > course['duration']['end'])
        objRet['duration'] = 'Período informado é inválido.';

    return objRet;
};

// Validate a create Course
module.exports.validateNewCourse = function (course, callback) {
    var deferred = q.defer();

    var errors = validateCourse(course, utils.OPERATION_STATUS.NEW);
    if (Object.keys(errors).length !== 0) {
        deferred.reject(errors)
    }
    else {
        errors = validateDate(course);
        if (Object.keys(errors).length !== 0) {
            deferred.reject(errors)
        }
        else {
            course['duration']['start'] = moment(course['duration']['start'], 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
            course['duration']['end'] = moment(course['duration']['end'], 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
            deferred.resolve(course)
        }
    }


    deferred.promise.nodeify(callback);
    return deferred.promise;

};

// Validate a update Course
module.exports.validateUpdateCourse = function (course, callback) {
    var deferred = q.defer();

    var errors = validateCourse(course, utils.OPERATION_STATUS.UPDATE);
    if (Object.keys(errors).length !== 0) {
        deferred.reject(errors)
    }
    else {
        errors = validateDate(course);
        if (Object.keys(errors).length !== 0) {
            deferred.reject(errors)
        }
        else {
            course['duration']['start'] = moment(course['duration']['start'], 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
            course['duration']['end'] = moment(course['duration']['end'], 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
            deferred.resolve(course)
        }
    }

    deferred.promise.nodeify(callback);
    return deferred.promise;

};

module.exports.validateDate = validateDate;
module.exports.validateCourse = validateCourse;
