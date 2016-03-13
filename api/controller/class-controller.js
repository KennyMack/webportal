/**
 * Created by jonathan on 06/03/16.
 */
var courseController   = require('../controller/courses-controller');
var studentsController = require('../controller/students-controller');
var validator          = require('validator');
var q                  = require('q');
var moment             = require('moment');

module.exports.createClass = function (clas, callback) {
    var deferred = q.defer();

    var objRet = validateCourse(clas) && validateStudents(clas['class']);

    if (Object.keys(objRet).length !== 0){
        deferred.reject(objRet);
    }
    else {
        var actualCourse = null;
        courseController.getById(clas['_id'])
            .then(function (course) {
                actualCourse = course;
                var classCourse = [];
                for(var i= 0, length = clas['class'].length; i < length; i++){
                    if (!studentExistsInCourse(clas['class'][i], course.class)){
                        console.log('item ' + i);
                        classCourse.push(clas['class'][i]);
                    }
                }
                return studentsController.getByList(classCourse);
            },
            function (err) {
                deferred.reject(err);
            })
            .then(function (students) {
                return saveStudentsCourse(clas['_id'], students);
            },
            function(err){
                deferred.reject(err);
            })
            .then(function (students) {
                return saveCourseClass(actualCourse, students);
            },
            function(err){
                deferred.reject(err);
            })
            .then(function (students) {
                deferred.resolve(students);
            },
            function (err) {
                deferred.reject(err);
            });
    }

    deferred.promise.nodeify(callback);
    return deferred.promise;
};

var saveCourseClass = function (course, students, callback) {
    var deferred = q.defer();
    if (students.length > 0) {
        for (var i = 0, length = students.length; i < length; i++) {
            course.class.push({
                _id: students[i]._id,
                name: students[i].name
            });
        }
        course.save(function (err, course) {
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

var saveStudentsCourse = function (id, students, callback) {
    var deferred = q.defer();
    var async = require('async');
    
    async.eachSeries(students, function (student, done) {

        if (!studentHasCourse(id, student.courses)) {
            student.courses.push({
                _id: id,
                active: 1,
                duration: {
                    start: moment()
                }
            });
            student.save(done);
        }

    }, function(err) {
        if (err)
            deferred.reject(err);
        else
            deferred.resolve(students);
    });

    deferred.promise.nodeify(callback);
    return deferred.promise;
};

var studentHasCourse = function (id, courses) {
    if (courses > 0) {
        for (var i = 0, length = courses.length; i < length; i++) {
            if (courses[i]['_id'].toString() === id.toString()){
                return true;
            }
        }
    }

    return false;
};

var studentExistsInCourse = function (id, course) {
    for (var i = 0, length = course.length; i < length; i++) {
        if (course[i]['_id'].toString() === id.toString()){
            return true;
        }
    }
    return false;
};

var validateStudents = function (students) {
    var objRet = {};
    if (students.length > 0) {
        for (var i = 0, len = students.length; i < len; i++) {
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

var validateCourse = function (course) {
    var objRet = {};
    course['_id'] = validator.trim(validator.escape(course['_id'].toString() || ''));

    if (validator.isNull(course['_id']))
        objRet['_id'] = "Id do Curso é de preenchimento obrigatório.";
    else if (!validator.isMongoId(course['_id']))
        objRet['_id'] = "Id do Curso informado é inválido.";

    return objRet;
};

var validateStudent = function(clas)  {
    var objRet = {};
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

module.exports.deactiveStudent = function (clas, callback) {
    var deferred = q.defer();

    var objRet = validateStudent(clas);
    if (Object.keys(objRet).length !== 0){
        deferred.reject(objRet);
    }
    else {
        studentsController.getById(clas['_idstudent'])
            .then(function (student) {
                var found = false;
                for (var i = 0, length = student.courses.length; i < length; i++) {
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
                    student.save(function (err, student) {
                        if (err)
                            deferred.reject(err);
                        else
                            deferred.resolve(student);
                    });
                }
                else
                    deferred.resolve(student);
            },
            function (err) {
                deferred.reject(err);

            });
    }
    deferred.promise.nodeify(callback);
    return deferred.promise;
};

module.exports.activateStudent = function (clas, callback) {
    var deferred = q.defer();

    var objRet = validateStudent(clas);
    if (Object.keys(objRet).length !== 0){
        deferred.reject(objRet);
    }
    else {
        studentsController.getById(clas['_idstudent'])
            .then(function (student) {
                var found = false;
                for (var i = 0, length = student.courses.length; i < length; i++) {
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
                    student.save(function (err, student) {
                        if (err)
                            deferred.reject(err);
                        else
                            deferred.resolve(student);
                    });
                }
                else
                    deferred.resolve(student);
            },
            function (err) {
                deferred.reject(err);

            });
    }
    deferred.promise.nodeify(callback);
    return deferred.promise;
};