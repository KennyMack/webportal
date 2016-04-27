/**
 * Created by jonathan on 03/03/16.
 */
var teachersModel = require('../models/teachers-model');
var validator     = require('validator');
var utils         = require('../utils/utils');
var q             = require('q');
var moment        = require('moment');

// List all Teachers
module.exports.listTeachers = function() {
    return teachersModel.teachers.find({}).exec();
};

// Get Teacher By Id
module.exports.getById = getById;

const getById = function (id) {
  return new Promise(function (resolve, reject) {
      teachersModel.teachers.findById(id)
          .exec()
          .then(resolve, reject);
  });
};

// Remove Teacher By Id
module.exports.removeById = function(id) {
    return teachersModel.teachers.findByIdAndRemove(id).exec();
};

// Create a Teacher
module.exports.createTeacher = function(teacher) {
    return new teachersModel.teachers({
        'identify': teacher['identify'],
        'name': teacher['name'],
        'gender': teacher['gender'],
        'dob': teacher['dob'],
        'active': teacher['active'],
        'social_number': teacher['social_number']
    }).save();
};

// Update a Teacher
module.exports.updateTeacher = function (teacher) {

    var query = { _id: teacher['_id'] };
    var data = {
        'identify': teacher['identify'],
        'name': teacher['name'],
        'gender': teacher['gender'],
        'dob': teacher['dob'],
        'active': teacher['active'],
        'social_number': teacher['social_number']
    };

    return teachersModel.teachers.update(query, data, { upsert: false }).exec();
};

// Validate fields
module.exports.validateTeacher = function (teacher, status) {
    return new Promise(function (resolve, reject) {

        let objRet = {};

        if (status !== utils.OPERATION_STATUS.DELETE &&
            status !== utils.OPERATION_STATUS.SELECT) {
            teacher['identify'] = validator.trim(validator.escape(teacher['identify'].toString() || ''));
            teacher['name'] = validator.trim(validator.escape(teacher['name'].toString() || ''));
            teacher['gender'] = validator.trim(validator.escape(teacher['gender'].toString() || ''));
            teacher['dob'] = validator.trim(teacher['dob'].toString() || '');
            teacher['social_number'] = validator.trim(validator.escape(teacher['social_number'].toString() || ''));
            teacher['active'] = validator.trim(validator.escape(teacher['active'].toString() || ''));

            if (validator.isNull(teacher['name']))
                objRet['name'] = 'Nome é de preenchimento obrigatório.';

            if (validator.isNull(teacher['gender']))
                objRet['gender'] = 'Sexo é de preenchimento obrigatório.';
            else if (!validator.isIn(teacher['gender'], ['M', 'F']))
                objRet['gender'] = 'Sexo informado não é válido.';

            if (validator.isNull(teacher['dob']))
                objRet['dob'] = 'Data de nascimento é de preenchimento obrigatório.';
            else if (!validator.isDate(teacher['dob']))
                objRet['dob'] = 'Data de nascimento informada não é válida.';

            if ((!validator.isNull(teacher['active'])) &&
                (!validator.isIn(teacher['active'], [0, 1])))
                objRet['active'] = 'Status informado não é válido.';


        }

        if (status === utils.OPERATION_STATUS.UPDATE ||
            status === utils.OPERATION_STATUS.SELECT ||
            status === utils.OPERATION_STATUS.DELETE) {
            teacher['_id'] = validator.trim(validator.escape(teacher['_id'].toString() || ''));

            var idNull = validator.isNull(teacher['_id']);

            if (idNull)
                objRet['_id'] = 'Id do professor é de preenchimento obrigatório.';

            if (!idNull && (!validator.isMongoId(teacher['_id'])))
                objRet['_id'] = 'Id do professor informado não é válido.';
        }

        if (Object.keys(objRet).length !== 0) {
            reject(objRet)
        }
        else {
            resolve(teacher);
        }
    });
};

// Validate Subject
const validateSubject = function (subject, status) {
    return new Promise(function (resolve, reject) {
        let objRet = {};
        subject['_id'] = validator.trim(validator.escape(subject['_id'].toString() || ''));
        subject['_idsubject'] = validator.trim(validator.escape(subject['_idsubject'].toString() || ''));

        if (status === utils.OPERATION_STATUS.NEW) {

            subject['description'] = validator.trim(validator.escape(subject['description'].toString() || ''));

            if (validator.isNull(subject['description']))
                objRet['description'] = 'Descrição da Matéria é de preenchimento obrigatório.';


        }

        if (validator.isNull(subject['_idsubject']))
            objRet['_idsubject'] = 'Id da materia é de preenchimento obrigatório.';
        else if (!validator.isMongoId(subject['_idsubject']))
            objRet['_idsubject'] = 'Id da materia informado é inválido.';

        if (validator.isNull(subject['_id']))
            objRet['_id'] = 'Id do Professor é de preenchimento obrigatório.';
        else if (!validator.isMongoId(subject['_id']))
            objRet['_id'] = 'Id do Professor informado é inválido.';

        if (Object.keys(objRet).length !== 0) {
            reject(objRet)
        }
        else {
            resolve(subject);
        }
    });
};

// Add subjects to Course
module.exports.addSubject = function(subject) {
    return new Promise(function (resolve, reject) {

        validateSubject(subject, utils.OPERATION_STATUS.NEW)
            .then(function (psubject) {
                return getById(psubject['_id']);
            })
            .then(function (teacher) {
                if (teacher) {
                    let subjectOk = true;
                    let teacherSubjects = teacher.subjects;

                    for (let i = 0, length = teacherSubjects.length; i < length; i++) {
                        if (teacherSubjects[i]._id.toString() === subject['_idsubject'].toString()) {
                            subjectOk = false;
                            break;
                        }
                    }

                    if (subjectOk) {
                        teacher.subjects.push({
                            _id: subject['_idsubject'],
                            description: subject['description']
                        });

                        teacher.save(function (err, teacher) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(teacher);
                            }
                        });
                    }
                    else {
                        reject({subject: "Matéria já vinculada neste professor."});
                    }
                }
                else
                    reject('404 - Not Found');

            })
            .catch(function (err) {
                reject(err);
            });



    });
};

const removeItemSubject = function (subject) {
    return new Promise(function (resolve, reject) {
        const query = { _id: subject['_id'] };
        const data = {
            $pull: {
                "subjects": {
                    _id: subject['_idsubject']
                }
            }
        };
        const options = { safe: true, upsert: true, new: true };
        teachersModel.teachers.findOneAndUpdate(query, data, options, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
};

// Remove subjects of Course
module.exports.removeSubject = function(subject) {
    return new Promise(function (resolve, reject) {
        validateSubject(subject, utils.OPERATION_STATUS.DELETE)
            .then(removeItemSubject)
            .then(resolve)
            .catch(reject);

    });
};

// Validate Schedule
var validateSchedule = function (item, status) {
    var objRet = {};
    if (status === utils.OPERATION_STATUS.NEW ||
        status === utils.OPERATION_STATUS.UPDATE) {
        item['day'] = validator.trim(validator.escape(item['day'].toString() || ''));
        item['duration']['start']  = validator.trim(item['duration']['start'].toString() || '');
        item['duration']['end']  = validator.trim(item['duration']['end'].toString() || '');


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
        objRet['_id'] = 'Id do Professor é de preenchimento obrigatório.';
    else if (!validator.isMongoId(item['_id']))
        objRet['_id'] = 'Id do Professor informado é inválido.';

    return objRet;
};

// Add Schedule to Teacher
module.exports.addSchedule = function (item, callback) {

    var deferred = q.defer();

    var objRet = validateSchedule(item, utils.OPERATION_STATUS.NEW);

    if (Object.keys(objRet).length !== 0) {
        deferred.reject(objRet);
    }
    else {
        teachersModel.teachers.findById(item['_id']).exec()
            .then(function (teacher) {
                if (teacher) {
                    objRet = validateDateScheduleItem(item, teacher);

                    if (Object.keys(objRet).length !== 0) {
                        deferred.reject(objRet);
                    }
                    else {
                        teacher.schedule.push({
                            day: item['day'],
                            duration: {
                                start: moment(item['duration']['start']).format('YYYY-MM-DD HH:mm:ss'),
                                end: moment(item['duration']['end']).format('YYYY-MM-DD HH:mm:ss')
                            }
                        });

                        teacher.save(function (err, teacher) {
                            if (err) {
                                deferred.reject(err);
                            } else {
                                deferred.resolve(teacher)
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

var validateDateScheduleItem = function (item, teacher) {
    // TODO: FINALIZAR
    return new Promise(function (resolve, reject) {
        let objRet = {};
        let candidateScheduleItem = {
            start: moment(item['duration']['start']).format('HH:mm:ss'),
            end: moment(item['duration']['end']).format('HH:mm:ss')
        };
        if (candidateScheduleItem.start > candidateScheduleItem.end) {
            objRet['duration'] = 'Período informado é inválido.';
        }
        else {

            for (var i = 0, length = teacher.schedule.length; i < length; i++) {
                if (teacher.schedule[i].day == item['day']) {

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

                    if (Object.keys(objRet).length !== 0) {
                        break;
                    }

                    scheduleItem = null;
                }
            }
        }
        if (Object.keys(objRet).length !== 0) {
            reject(objRet);
        }
        else {
            resolve({item: course.item, course: course.course});
        }
        objRet = null;
        candidateScheduleItem = null;

    });
};

const removeItemSchedule = function (schedule) {
    return new Promise(function (resolve, reject) {
        const query = { _id: schedule['_id'] };
        const data = {
            $pull: {
                "schedule": {
                    _id: schedule['_idschedule']
                }
            }
        };
        const options = { safe: true, upsert: false, new: true };
        teachersModel.teachers.findOneAndUpdate(query, data, options, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
};

// Remove schedule of Teacher
module.exports.removeSchedule = function(item) {
    return new Promise(function (resolve, reject) {
        validateSchedule(item, utils.OPERATION_STATUS.DELETE)
            .then(removeItemSchedule)
            .then(resolve)
            .catch(reject);
    });

};
