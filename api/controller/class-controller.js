/**
 * Created by jonathan on 06/03/16.
 */
'use strict';
//TODO: I will change in future, I promise :)

const courseController   = require('../controller/courses-controller');
const studentsController = require('../controller/students-controller');
const validator          = require('validator');
const q                  = require('q');
const moment             = require('moment');

module.exports.createClass =  (roomClass, callback) => {

    let deferred = q.defer();

    let objRet = validateCourse(roomClass) && validateStudents(roomClass['class']);

    if (Object.keys(objRet).length !== 0){
        deferred.reject(objRet);
    }
    else {
        let actualCourse = null;
        courseController.getById(roomClass['_id'])
            .then( (course) => {
                actualCourse = course;
                let classCourse = [];
                for (let i = 0, length = roomClass['class'].length; i < length; i++) {
                    if (!studentExistsInCourse(roomClass['class'][i], course.class)) {
                        classCourse.push(roomClass['class'][i]);
                    }
                }
                return studentsController.getByList(classCourse);
            },
             (err) => {
                deferred.reject(err);
            })
            .then( (students) => {
                return saveStudentsCourse(roomClass['_id'], students);
            },
            (err)=> {
                deferred.reject(err);
            })
            .then( (students) => {
                return saveCourseClass(actualCourse, students);
            },
            (err)=> {
                deferred.reject(err);
            })
            .then( (students) => {
                deferred.resolve(students);
            },
             (err) => {
                deferred.reject(err);
            });
    }

    deferred.promise.nodeify(callback);
    return deferred.promise;
};

const saveCourseClass =  (course, students, callback) => {
    let deferred = q.defer();
    if (students.length > 0) {
        for (let i = 0, length = students.length; i < length; i++) {
            course.class.push({
                _id: students[i]._id,
                name: students[i].name
            });
        }
        course.save( (err, course) => {
            if (err)
                deferred.reject('Não foi possível atualizar o curso.');
            else
                deferred.resolve(course);
        })
    }
    else
        deferred.resolve(course);

    deferred.promise.nodeify(callback);
    return deferred.promise;
};

const saveStudentsCourse =  (id, students, callback) => {
    let deferred = q.defer();
    let async = require('async');
    
    async.eachSeries(students,  (student, done) => {

        if (!studentHasCourse(id, student.courses)) {
            student.courses.push({
                _id: id,
                active: 1,
                duration: {
                    start: moment(),
                    end: null
                }
            });
            student.save(done);
        }

    }, (err) => {
        if (err)
            deferred.reject(err);
        else
            deferred.resolve(students);
    });

    deferred.promise.nodeify(callback);
    return deferred.promise;
};

const studentHasCourse =  (id, courses) => {
    if (courses > 0) {
        for (let i = 0, length = courses.length; i < length; i++) {
            if (courses[i]['_id'].toString() === id.toString()){
                return true;
            }
        }
    }

    return false;
};

const studentExistsInCourse =  (id, course) => {
    for (let i = 0, length = course.length; i < length; i++) {
        if (course[i]['_id'].toString() === id.toString()){
            return true;
        }
    }
    return false;
};

const validateStudents =  (students) => {
    let objRet = {};
    if (students.length > 0) {
        for (let i = 0, len = students.length; i < len; i++) {
            students[i] = validator.trim(validator.escape(students[i].toString() || ''));

            if (!validator.isMongoId(students[i])) {
                objRet['students'] = "Id do aluno informado é inválido.";
                break;
            }
        }
    }
    else {
        objRet['students'] = "Ao menos 1 aluno deve ser informado.";
    }
    return objRet;
};

const validateCourse =  (course) => {
    let objRet = {};
    course['_id'] = validator.trim(validator.escape(course['_id'].toString() || ''));

    if (validator.isNull(course['_id']))
        objRet['_id'] = "Id do Curso é de preenchimento obrigatório.";
    else if (!validator.isMongoId(course['_id']))
        objRet['_id'] = "Id do Curso informado é inválido.";

    return objRet;
};

const validateStudent = (clas)  => {
    let objRet = {};
    clas['_id'] = validator.trim(validator.escape(clas['_id'].toString() || ''));
    clas['_idstudent'] = validator.trim(validator.escape(clas['_idstudent'].toString() || ''));

    if (validator.isNull(clas['_id']))
        objRet['_id'] = "Id do Curso é de preenchimento obrigatório.";
    else if (!validator.isMongoId(clas['_id']))
        objRet['_id'] = "Id do Curso informado é inválido.";

    if (validator.isNull(clas['_idstudent']))
        objRet['_idstudent'] = "Id do aluno é de preenchimento obrigatório.";
    else if (!validator.isMongoId(clas['_idstudent']))
        objRet['_idstudent'] = "Id do aluno informado é inválido.";

    return objRet;
};

module.exports.deactiveStudent =  (clas, callback) => {
    let deferred = q.defer();

    let objRet = validateStudent(clas);
    if (Object.keys(objRet).length !== 0){
        deferred.reject(objRet);
    }
    else {
        studentsController.getById(clas['_idstudent'])
            .then( (student) => {
                let found = false;
                for (let i = 0, length = student.courses.length; i < length; i++) {
                    if (student.courses[i]._id.toString() === clas['_id'].toString()) {
                        student.courses[i].duration = {
                            start: student.courses[i].duration.start,
                            end: moment()
                        };
                        student.courses[i].active = 0;
                        found = true;
                        break;
                    }
                }

                if (found) {
                    student.save( (err, student) => {
                        if (err)
                            deferred.reject(err);
                        else
                            deferred.resolve(student);
                    });
                }
                else
                    deferred.resolve(student);
            },
             (err) => {
                deferred.reject(err);

            });
    }
    deferred.promise.nodeify(callback);
    return deferred.promise;
};

module.exports.activateStudent =  (clas, callback) => {
    let deferred = q.defer();

    let objRet = validateStudent(clas);
    if (Object.keys(objRet).length !== 0){
        deferred.reject(objRet);
    }
    else {
        studentsController.getById(clas['_idstudent'])
            .then( (student) => {
                let found = false;
                for (let i = 0, length = student.courses.length; i < length; i++) {
                    if (student.courses[i]._id.toString() === clas['_id'].toString() &&
                        student.courses[i].active === 0) {
                        student.courses[i].duration = {
                            start: student.courses[i].duration.start
                        };
                        student.courses[i].active = 1;
                        found = true;
                        break;
                    }
                }

                if (found) {
                    student.save( (err, student) => {
                        if (err)
                            deferred.reject(err);
                        else
                            deferred.resolve(student);
                    });
                }
                else
                    deferred.resolve(student);
            },
             (err) => {
                deferred.reject(err);

            });
    }
    deferred.promise.nodeify(callback);
    return deferred.promise;
};