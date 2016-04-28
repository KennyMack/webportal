/**
 * Created by jonathan on 03/03/16.
 */
'use strict';

var teachersModel = require('../models/teachers-model');
var validator = require('validator');
var utils = require('../utils/utils');
var moment = require('moment');

// List all Teachers
module.exports.listTeachers = function () {
    return new Promise(function (resolve, reject) {
        teachersModel.teachers.find({}).exec().then(resolve, reject);
    });
};

var getById = function getById(id) {
    return new Promise(function (resolve, reject) {
        teachersModel.teachers.findById(id).exec().then(resolve, reject);
    });
};

// Get Teacher By Id
module.exports.getById = getById;

// Remove Teacher By Id
module.exports.removeById = function (id) {
    return new Promise(function (resolve, reject) {
        teachersModel.teachers.findByIdAndRemove(id).exec().then(resolve, reject);
    });
};

// Create a Teacher
module.exports.createTeacher = function (teacher) {
    return new Promise(function (resolve, reject) {
        new teachersModel.teachers({
            'identify': teacher['identify'],
            'name': teacher['name'],
            'gender': teacher['gender'],
            'dob': teacher['dob'],
            'active': teacher['active'],
            'social_number': teacher['social_number']
        }).save().then(resolve, reject);
    });
};

// Update a Teacher
module.exports.updateTeacher = function (teacher) {
    return new Promise(function (resolve, reject) {
        var query = { _id: teacher['_id'] };
        var data = {
            'identify': teacher['identify'],
            'name': teacher['name'],
            'gender': teacher['gender'],
            'dob': teacher['dob'],
            'active': teacher['active'],
            'social_number': teacher['social_number']
        };

        teachersModel.teachers.update(query, data, { upsert: false, new: true }).exec().then(resolve, reject);
    });
};

// Validate fields
module.exports.validateTeacher = function (teacher, status) {
    return new Promise(function (resolve, reject) {

        var objRet = {};

        if (status !== utils.OPERATION_STATUS.DELETE && status !== utils.OPERATION_STATUS.SELECT) {
            teacher['identify'] = validator.trim(validator.escape(teacher['identify'].toString() || ''));
            teacher['name'] = validator.trim(validator.escape(teacher['name'].toString() || ''));
            teacher['gender'] = validator.trim(validator.escape(teacher['gender'].toString() || ''));
            teacher['dob'] = validator.trim(teacher['dob'].toString() || '');
            teacher['social_number'] = validator.trim(validator.escape(teacher['social_number'].toString() || ''));
            teacher['active'] = validator.trim(validator.escape(teacher['active'].toString() || ''));

            if (validator.isNull(teacher['name'])) objRet['name'] = 'Nome é de preenchimento obrigatório.';

            if (validator.isNull(teacher['gender'])) objRet['gender'] = 'Sexo é de preenchimento obrigatório.';else if (!validator.isIn(teacher['gender'], ['M', 'F'])) objRet['gender'] = 'Sexo informado não é válido.';

            if (validator.isNull(teacher['dob'])) objRet['dob'] = 'Data de nascimento é de preenchimento obrigatório.';else if (!validator.isDate(teacher['dob'])) objRet['dob'] = 'Data de nascimento informada não é válida.';

            if (!validator.isNull(teacher['active']) && !validator.isIn(teacher['active'], [0, 1])) objRet['active'] = 'Status informado não é válido.';
        }

        if (status === utils.OPERATION_STATUS.UPDATE || status === utils.OPERATION_STATUS.SELECT || status === utils.OPERATION_STATUS.DELETE) {
            teacher['_id'] = validator.trim(validator.escape(teacher['_id'].toString() || ''));

            var idNull = validator.isNull(teacher['_id']);

            if (idNull) objRet['_id'] = 'Id do professor é de preenchimento obrigatório.';

            if (!idNull && !validator.isMongoId(teacher['_id'])) objRet['_id'] = 'Id do professor informado não é válido.';
        }

        if (Object.keys(objRet).length !== 0) {
            reject(objRet);
        } else {
            resolve(teacher);
        }
    });
};

// Validate Subject
var validateSubject = function validateSubject(subject, status) {
    return new Promise(function (resolve, reject) {
        var objRet = {};
        subject['_id'] = validator.trim(validator.escape(subject['_id'].toString() || ''));
        subject['_idsubject'] = validator.trim(validator.escape(subject['_idsubject'].toString() || ''));

        if (status === utils.OPERATION_STATUS.NEW) {

            subject['description'] = validator.trim(validator.escape(subject['description'].toString() || ''));

            if (validator.isNull(subject['description'])) objRet['description'] = 'Descrição da Matéria é de preenchimento obrigatório.';
        }

        if (validator.isNull(subject['_idsubject'])) objRet['_idsubject'] = 'Id da materia é de preenchimento obrigatório.';else if (!validator.isMongoId(subject['_idsubject'])) objRet['_idsubject'] = 'Id da materia informado é inválido.';

        if (validator.isNull(subject['_id'])) objRet['_id'] = 'Id do Professor é de preenchimento obrigatório.';else if (!validator.isMongoId(subject['_id'])) objRet['_id'] = 'Id do Professor informado é inválido.';

        if (Object.keys(objRet).length !== 0) {
            reject(objRet);
        } else {
            resolve(subject);
        }
    });
};

var addSubjectItem = function addSubjectItem(teacher, subject) {
    return new Promise(function (resolve, reject) {
        if (!teacher) reject('404 - Not Found');else {
            teachersModel.teachers.find({
                '_id': subject['_id'],
                'subjects._id': subject['_idsubject']
            }).exec().then(function (result) {
                if (result.length === 0) {
                    teacher.subjects.push({
                        _id: subject['_idsubject'],
                        description: subject['description']
                    });
                    teacher.save().then(resolve, reject);
                } else {
                    reject({ subject: "Matéria já vinculada neste professor." });
                }
            }, function (err) {
                reject(err);
            });
        }
    });
};

// Add subjects to Course
module.exports.addSubject = function (subject) {
    return new Promise(function (resolve, reject) {

        validateSubject(subject, utils.OPERATION_STATUS.NEW).then(function (psubject) {
            return getById(psubject['_id']);
        }).then(function (teacher) {
            return addSubjectItem(teacher, subject);
        }).then(resolve).catch(reject);
    });
};

// Remove subject Item
var removeItemSubject = function removeItemSubject(subject) {
    return new Promise(function (resolve, reject) {
        var query = { _id: subject['_id'] };
        var data = {
            $pull: {
                "subjects": {
                    _id: subject['_idsubject']
                }
            }
        };
        var options = { safe: true, upsert: true, new: true };
        teachersModel.teachers.findOneAndUpdate(query, data, options).exec().then(resolve, reject);
    });
};

// Remove subjects of Course
module.exports.removeSubject = function (subject) {
    return new Promise(function (resolve, reject) {
        validateSubject(subject, utils.OPERATION_STATUS.DELETE).then(removeItemSubject).then(resolve).catch(reject);
    });
};

// Validate Schedule
var validateSchedule = function validateSchedule(item, status) {
    return new Promise(function (resolve, reject) {

        var objRet = {};
        if (status === utils.OPERATION_STATUS.NEW || status === utils.OPERATION_STATUS.UPDATE) {
            item['day'] = validator.trim(validator.escape(item['day'].toString() || ''));
            item['duration']['start'] = validator.trim(item['duration']['start'].toString() || '');
            item['duration']['end'] = validator.trim(item['duration']['end'].toString() || '');

            if (validator.isNull(item['day'])) objRet['day'] = 'Dia da semana é de preenchimento obrigatório.';else if (!validator.isInt(item['day'])) objRet['day'] = 'Dia da semana informado é inválido.';else if (!validator.isIn(item['day'], [1, 2, 3, 4, 5, 6, 7])) objRet['day'] = 'Dia da semana informado é inválido.';

            if (validator.isNull(item['duration']['start'])) objRet['start'] = 'Data de início é de preenchimento obrigatório.';else if (!validator.isDate(item['duration']['start'])) objRet['start'] = 'Data de início informada não é válida.';

            if (validator.isNull(item['duration']['end'])) objRet['end'] = 'Data de término é de preenchimento obrigatório.';else if (!validator.isDate(item['duration']['end'])) objRet['end'] = 'Data de término informada não é válida.';
        }
        if (status === utils.OPERATION_STATUS.DELETE) {

            item['_idschedule'] = validator.trim(validator.escape(item['_idschedule'].toString() || ''));
            if (validator.isNull(item['_idschedule'])) objRet['_idschedule'] = 'Id do item do cronograma é de preenchimento obrigatório.';else if (!validator.isMongoId(item['_idschedule'])) objRet['_idschedule'] = 'Id do item do cronograma informado é inválido.';
        }

        item['_id'] = validator.trim(validator.escape(item['_id'].toString() || ''));
        if (validator.isNull(item['_id'])) objRet['_id'] = 'Id do Professor é de preenchimento obrigatório.';else if (!validator.isMongoId(item['_id'])) objRet['_id'] = 'Id do Professor informado é inválido.';

        if (Object.keys(objRet).length !== 0) {
            reject(objRet);
        } else {
            resolve(item);
        }
    });
};

var getTeacherSchedule = function getTeacherSchedule(item) {
    return new Promise(function (resolve, reject) {
        getById(item['_id']).then(function (teacher) {
            resolve({
                item: item,
                teacher: teacher
            });
        }).catch(reject);
    });
};

var addScheduleItem = function addScheduleItem(itemSchedule) {
    return new Promise(function (resolve, reject) {
        itemSchedule.teacher.schedule.push({
            day: itemSchedule.item['day'],
            duration: {
                start: moment(itemSchedule.item['duration']['start']).format('YYYY-MM-DD HH:mm:ss'),
                end: moment(itemSchedule.item['duration']['end']).format('YYYY-MM-DD HH:mm:ss')
            }
        });

        itemSchedule.teacher.save().then(resolve, reject);
    });
};

// Add Schedule to Teacher
module.exports.addSchedule = function (item) {
    return new Promise(function (resolve, reject) {
        validateSchedule(item, utils.OPERATION_STATUS.NEW).then(getTeacherSchedule).then(validateDateScheduleItem).then(addScheduleItem).then(resolve).catch(reject);
    });
};

var validateDateScheduleItem = function validateDateScheduleItem(itemSchedule) {
    return new Promise(function (resolve, reject) {
        var objRet = {};
        var candidateScheduleItem = {
            start: moment(itemSchedule.item['duration']['start']).format('HH:mm:ss'),
            end: moment(itemSchedule.item['duration']['end']).format('HH:mm:ss')
        };
        if (candidateScheduleItem.start >= candidateScheduleItem.end) {
            objRet['duration'] = 'Período informado é inválido.';
        } else {
            var teacher = itemSchedule.teacher;

            for (var i = 0, length = teacher.schedule.length; i < length; i++) {
                if (teacher.schedule[i].day == itemSchedule.item['day']) {

                    var scheduleItem = {
                        start: moment(teacher.schedule[i].duration.start).format('HH:mm:ss'),
                        end: moment(teacher.schedule[i].duration.end).format('HH:mm:ss')
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

                    if (Object.keys(objRet).length !== 0) {
                        break;
                    }

                    scheduleItem = null;
                }
            }
            teacher = null;
        }
        if (Object.keys(objRet).length !== 0) {
            reject(objRet);
        } else {
            resolve(itemSchedule);
        }
        objRet = null;
        candidateScheduleItem = null;
    });
};

var removeItemSchedule = function removeItemSchedule(schedule) {
    return new Promise(function (resolve, reject) {
        var query = { _id: schedule['_id'] };
        var data = {
            $pull: {
                "schedule": {
                    _id: schedule['_idschedule']
                }
            }
        };
        var options = { safe: true, upsert: false, new: true };
        teachersModel.teachers.findOneAndUpdate(query, data, options, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

// Remove schedule of Teacher
module.exports.removeSchedule = function (item) {
    return new Promise(function (resolve, reject) {
        validateSchedule(item, utils.OPERATION_STATUS.DELETE).then(removeItemSchedule).then(resolve).catch(reject);
    });
};

//# sourceMappingURL=teachers-controller-compiled.js.map