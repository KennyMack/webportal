/**
 * Created by jonathan on 01/03/16.
 */
'use strict';
const coursesModel = require('../models/courses-model');
const validator   = require('validator');
const utils       = require('../utils/utils');
const q           = require('q');
const moment      = require('moment');
// List all Courses
module.exports.listCourses = function() {
    return coursesModel.courses.find({})
        .populate('subjects.teacher', 'name')
        .populate('subjects.subject', 'description')
        .exec();
};

// Get Course By Id
module.exports.getById = function(id) {
    return coursesModel.courses.findById(id)
        .populate('subjects.teacher', 'name')
        .populate('subjects.subject', 'description')
        .exec();
};

// Get Subjects in Course
module.exports.getCourseSubjects = function (id) {
    return coursesModel.courses.findById(id)
        .select('subjects.subject')
        .populate('subjects.subject', 'description')
        .exec();

};

// Remove Course By Id
module.exports.removeById = function(id) {
    return coursesModel.courses.findByIdAndRemove(id).exec();
};

// Create a Course
module.exports.createCourse = function(course) {
    return new coursesModel.courses({
        'identify': course['identify'],
        'name': course['name'],
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
module.exports.updateCourse = function (course, callback) {
    var deferred = q.defer();
    var query = { _id: course['_id'] };
    var data = {
        'identify': course['identify'],
        'name': course['name'],
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

    coursesModel.courses.findOneAndUpdate(query, data, { upsert: false, new: true }, function (err, data) {
        if (err)
            deferred.reject(err);
        else
            deferred.resolve(data);
    });



    deferred.promise.nodeify(callback);
    return deferred.promise;
};

// Validate Subject
var validateSubject = function (subject, status) {
    return new Promise(function (resolve, reject) {
        let objRet = {};
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

        if (Object.keys(objRet).length !== 0)
            reject(objRet);
        else
            resolve(subject);
    });
};

// Add subjects to Course
module.exports.addSubject = function(subject) {
    return new Promise(function (resolve, reject) {
        validateSubject(subject, utils.OPERATION_STATUS.NEW)
            .then(hasCourseSubject)
            .then(addSubjectItem)
            .then(function (data) {
                resolve(data);
            })
            .catch(function (err) {
                reject(err);
            });

    });
};

// verify wheater course has subject
var hasCourseSubject = function (subject) {
    return new Promise(function (resolve, reject) {
        let query = {
            _id: subject['_id'],
            "subjects.subject": subject['subject']
        };

        coursesModel.courses.find(query, function (err, course) {
            if (err)
                reject(err);
            else
                resolve({ subject: subject, course: course });
        });
    });
};

// add new subject to course
var addSubjectItem = function (course) {
    return new Promise(function (resolve, reject) {
        if (course.course.length === 0) {
            let query = { _id: course.subject['_id'] };
            let options = { safe: true, upsert: true, new: true };
            let data = {
                $push: {
                    "subjects": {
                        teacher: course.subject.teacher,
                        subject: course.subject.subject,
                        schedule: []
                    }
                }
            };
            coursesModel.courses.findOneAndUpdate(query, data, options)
                .populate('subjects.teacher', 'name')
                .populate('subjects.subject', 'description')
                .exec()
                .then(function (data) {
                    resolve(data);
                }, function (err) {
                    reject(err);
                });
        }
        else {
            reject({ subject : "Matéria já vinculada neste curso." });
        }
    });
};

// Remove subjects of Course
module.exports.removeSubject = function(subject) {
    return new Promise(function (resolve, reject) {
        validateSubject(subject, utils.OPERATION_STATUS.DELETE)
            .then(removeSubjectItem)
            .then(function (data) {
                resolve(data);
            })
            .catch(function (err) {
                reject(err);
            });
    });
};

// remove subject of course
var removeSubjectItem = function (subject) {
    return new Promise(function (resolve, reject) {
        let query = { _id: subject['_id'] };
        let data = {
            $pull: {
                "subjects": {
                    _id: subject['_idsubject']
                }
            }
        };
        let options = { safe: true, upsert: true, new: true };
        coursesModel.courses.findOneAndUpdate(query, data, options, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
};

// Validate Schedule
var validateSchedule = function (item, status) {
    return new Promise(function (resolve, reject) {
        var objRet = {};
        if (status === utils.OPERATION_STATUS.NEW ||
            status === utils.OPERATION_STATUS.UPDATE) {
            item['day'] = validator.trim(validator.escape(item['day'].toString() || ''));
            item['subject'] = validator.trim(validator.escape(item['subject'].toString() || ''));
            item['duration']['start'] = validator.trim(item['duration']['start'].toString() || '');
            item['duration']['end'] = validator.trim(item['duration']['end'].toString() || '');

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
        if (status === utils.OPERATION_STATUS.DELETE) {

            item['_idschedule'] = validator.trim(validator.escape(item['_idschedule'].toString() || ''));
            if (validator.isNull(item['_idschedule']))
                objRet['_idschedule'] = 'Id do item do cronograma é de preenchimento obrigatório.';
            else if (!validator.isMongoId(item['_idschedule']))
                objRet['_idschedule'] = 'Id do item do cronograma informado é inválido.';


            item['_idsubject'] = validator.trim(validator.escape(item['_idsubject'].toString() || ''));
            if (validator.isNull(item['_idsubject']))
                objRet['_idsubject'] = 'Id da matéria é de preenchimento obrigatório.';
            else if (!validator.isMongoId(item['_idsubject']))
                objRet['_idsubject'] = 'Id da matéria informado é inválido.';
        }

        item['_id'] = validator.trim(validator.escape(item['_id'].toString() || ''));
        if (validator.isNull(item['_id']))
            objRet['_id'] = 'Id do Curso é de preenchimento obrigatório.';
        else if (!validator.isMongoId(item['_id']))
            objRet['_id'] = 'Id do Curso informado é inválido.';


        if (Object.keys(objRet).length !== 0)
            reject(objRet);
        else {
            objRet = null;
            resolve(item);
        }
    });
};

// Add Schedule to Course
module.exports.addSchedule = function (item) {
    return new Promise(function (resolve, reject) {
        validateSchedule(item, utils.OPERATION_STATUS.NEW)
            .then(existsCourse)
            .then(getSchedules)
            .then(validateDateScheduleItem)
            .then(function (result) {
                let course = result.course;
                let item = result.item;
                for (var i = 0, length = course.subjects.length; i < length; i++) {
                    if (course.subjects[i].subject == item['subject']) {
                        course.subjects[i].schedule.push({
                            day: item['day'],
                            subject: item['subject'],
                            duration: {
                                start: moment(item['duration']['start']).format('YYYY-MM-DD HH:mm:ss'),
                                end: moment(item['duration']['end']).format('YYYY-MM-DD HH:mm:ss')
                            }
                        });
                    }
                }
                return addSubjectSchedule(course);
            })
            .then(resolve)
            .catch(function (err) {
                reject(err);
            })
    });
};

// verify exists course
var existsCourse = function (item) {
    return new Promise(function (resolve, reject) {
        coursesModel.courses.findById(item['_id']).exec()
            .then(function (course) {
                if (!course){
                    reject(404);
                }
                else {
                    resolve({
                        item: item,
                        course: course
                    });
                }
            },
            function (err) {
                reject(err);
            });

    });
};

// get a list with course schedule
var getSchedules = function (item) {
    return new Promise(function (resolve, reject) {
        coursesModel.courses
            .aggregate([
                {
                    "$project": {
                        "_id": 1, "subjects": 1
                    }
                },
                {
                    $unwind: '$subjects'
                },
                {
                    "$match": {
                        _id: coursesModel.getObjectId(item.item['_id'])
                    }
                },
                {
                    $unwind: "$subjects.schedule"
                },
                {
                    "$match": {
                        "subjects.schedule.day": parseInt(item.item['day'])
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        subjects: {
                            $push: '$subjects.schedule'
                        }
                    }
                }
            ]).exec()
            .then(function (data) {
                resolve({
                    item: item.item,
                    course: item.course,
                    schedule: data
                });
            }, function (err) {
                reject(err);
            });

    });
};

// save new Schedule
var addSubjectSchedule = function (course) {
    return new Promise(function (resolve, reject) {
        let query = {_id: course._id};

        let options = {safe: true, upsert: true, new: true};
        coursesModel.courses.findOneAndUpdate(query, course, options)
            .populate('subjects.teacher', 'name')
            .populate('subjects.subject', 'description')
            .exec()
            .then(function (data) {
                resolve(data);
            }, function (err) {
                reject(err);
            });
    });
};

// validate Date Schedule Item
var validateDateScheduleItem = function (course) {
    return new Promise(function (resolve, reject) {
        let objRet = {};
        let candidateScheduleItem = {
            start: moment(course.item['duration']['start']).format('HH:mm:ss'),
            end: moment(course.item['duration']['end']).format('HH:mm:ss')
        };
        if (candidateScheduleItem.start >= candidateScheduleItem.end) {
            objRet['duration'] = 'Período informado é inválido.';
        }
        else {
            let schedule = course.schedule;
            if (schedule.length > 0) {
                for (let i = 0, length = schedule[0].subjects.length; i < length; i++) {
                    let scheduleItem = {
                        start: moment(schedule[0].subjects[i].duration.start).format('HH:mm:ss'),
                        end: moment(schedule[0].subjects[i].duration.end).format('HH:mm:ss')
                    };

                    if (utils.betweenII(candidateScheduleItem.start, scheduleItem.start, scheduleItem.end)) {
                        objRet['start'] = 'Já existe outra matéria vinculada neste Horário.';
                    }

                    if (utils.betweenII(candidateScheduleItem.end, scheduleItem.start, scheduleItem.end)) {
                        objRet['end'] = 'Já existe outra matéria vinculada neste Horário.';
                    }

                    if (utils.betweenII(scheduleItem.start, candidateScheduleItem.start, candidateScheduleItem.end)) {
                        objRet['end'] = 'Já existe outra matéria vinculada neste Horário.';
                    }

                    if (utils.betweenII(scheduleItem.end, candidateScheduleItem.start, candidateScheduleItem.end)) {
                        objRet['end'] = 'Já existe outra matéria vinculada neste Horário.';
                    }

                    scheduleItem = null;

                    if (Object.keys(objRet).length !== 0) {
                        break;
                    }
                }
            }
        }
        if (Object.keys(objRet).length !== 0) {
            reject(objRet);
        }
        else {
            resolve({ item: course.item, course: course.course });
        }
        objRet = null;
        candidateScheduleItem = null;

    });
};

// Remove Schedule to Course
module.exports.removeSchedule = function(item) {
    return new Promise(function (resolve, reject) {
        validateSchedule(item, utils.OPERATION_STATUS.DELETE)
            .then(existsCourse)
            .then(removeScheduleItem)
            .then(resolve)
            .catch(function (err) {
                reject(err);
            });
    });
};

// remove subject of course
var removeScheduleItem = function (schedule) {
    return new Promise(function (resolve, reject) {
        let course = schedule.course;
        let item = schedule.item;
        let query = { _id: item._id };
        for (let i = 0, lenSubject = course.subjects.length;  i < lenSubject; i++) {
            if (course.subjects[i].subject == item['_idsubject']) {
                for (let r = 0, lenSchedule = course.subjects[i].schedule.length; r < lenSchedule; r++) {
                    if (course.subjects[i].schedule[r]._id == item['_idschedule']) {
                        course.subjects[i].schedule.splice(r, 1);
                        break;
                    }

                }
            }
        }
        let options = { safe: true, upsert: true, new: true };
        coursesModel.courses.findOneAndUpdate(query, course, options, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
};

// Validate fields
var validateCourse = function (course, status) {
    return new Promise(function (resolve, reject) {

        var objRet = {};

        if (status !== utils.OPERATION_STATUS.DELETE &&
            status !== utils.OPERATION_STATUS.SELECT) {
            course['identify'] = validator.trim(validator.escape(course['identify'].toString() || ''));
            course['name'] = validator.trim(validator.escape(course['name'].toString() || ''));
            course['active'] = validator.trim(validator.escape(course['active'].toString() || ''));
            course['description'] = validator.trim(validator.escape(course['description'].toString() || ''));
            course['duration']['start'] = validator.trim(course['duration']['start'].toString() || '');
            course['duration']['end'] = validator.trim(course['duration']['end'].toString() || '');
            course['course_type']['_id'] = validator.trim(validator.escape(course['course_type']['_id'].toString() || ''));
            course['course_type']['description'] = validator.trim(validator.escape(course['course_type']['description'].toString() || ''));

            if (validator.isNull(course['description']))
                objRet['description'] = 'Descrição é de preenchimento obrigatório.';

            if (validator.isNull(course['name']))
                objRet['description'] = 'Nome do curso é de preenchimento obrigatório.';

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

        if (Object.keys(objRet).length !== 0)
            reject(objRet);
        else {
            objRet = null;
            resolve(course);
        }
    });
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
